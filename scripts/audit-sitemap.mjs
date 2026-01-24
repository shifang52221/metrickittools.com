import { spawn } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";
import process from "node:process";
import fs from "node:fs/promises";

const BASE = process.env.AUDIT_BASE_URL || "http://127.0.0.1:3000";
const CONCURRENCY = Number(process.env.AUDIT_CONCURRENCY || 20);
const TIMEOUT_MS = Number(process.env.AUDIT_TIMEOUT_MS || 15000);
const SAMPLE_LIMIT = process.env.AUDIT_SAMPLE_LIMIT
  ? Number(process.env.AUDIT_SAMPLE_LIMIT)
  : null;

function abortableFetch(url, { method = "GET" } = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
  return fetch(url, {
    method,
    redirect: "follow",
    signal: controller.signal,
    headers: {
      "User-Agent": "metrickittools-audit/1.0",
      Accept: "text/html,application/xml;q=0.9,*/*;q=0.8",
    },
  }).finally(() => clearTimeout(timeout));
}

async function fetchOk(url, preferredMethod = "GET") {
  const tryRequest = async (method) => {
    const res = await abortableFetch(url, { method });
    if (res.status === 405 && method === "HEAD") {
      return null;
    }
    return res;
  };

  if (preferredMethod === "HEAD") {
    const head = await tryRequest("HEAD");
    if (head) return head;
    return abortableFetch(url, { method: "GET" });
  }

  return abortableFetch(url, { method: preferredMethod });
}

function normalizeToPath(urlString) {
  const u = new URL(urlString);
  return u.pathname + (u.search || "");
}

function extractUrlsFromSitemap(xml, base) {
  const locMatches = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) =>
    m[1].trim(),
  );
  const paths = locMatches
    .map((loc) => {
      try {
        const u = new URL(loc);
        return u.pathname + (u.search || "");
      } catch {
        return null;
      }
    })
    .filter(Boolean);

  const uniq = [...new Set(paths)];
  return uniq.map((p) => new URL(p, base).toString());
}

function extractAssetUrlsFromHtml(html, pageUrl) {
  const base = new URL(pageUrl);
  const urls = [];

  for (const m of html.matchAll(/\s(?:src|href)=["']([^"'#]+)["']/gi)) {
    const raw = m[1].trim();
    if (!raw) continue;
    if (raw.startsWith("mailto:") || raw.startsWith("tel:")) continue;
    if (raw.startsWith("javascript:")) continue;
    if (raw.startsWith("data:")) continue;
    try {
      const u = new URL(raw, base);
      urls.push(u.toString());
    } catch {
      // ignore
    }
  }

  for (const m of html.matchAll(/\ssrcset=["']([^"']+)["']/gi)) {
    const raw = m[1];
    const parts = raw.split(",").map((x) => x.trim().split(/\s+/)[0]);
    for (const part of parts) {
      if (!part) continue;
      if (part.startsWith("data:")) continue;
      try {
        const u = new URL(part, base);
        urls.push(u.toString());
      } catch {
        // ignore
      }
    }
  }

  const uniq = [...new Set(urls)];
  return uniq;
}

async function runPool(items, worker, concurrency) {
  const queue = items.slice();
  const results = [];
  const runners = Array.from({ length: Math.max(1, concurrency) }, async () => {
    while (queue.length) {
      const item = queue.shift();
      results.push(await worker(item));
    }
  });
  await Promise.all(runners);
  return results;
}

function startNextServer() {
  const isWin = process.platform === "win32";
  const command = isWin ? "cmd.exe" : "npm";
  const args = isWin
    ? ["/c", "npm", "run", "start", "--", "-p", "3000"]
    : ["run", "start", "--", "-p", "3000"];

  const child = spawn(command, args, {
    stdio: ["ignore", "pipe", "pipe"],
    env: { ...process.env, PORT: "3000" },
    shell: false,
  });
  child.stdout.setEncoding("utf8");
  child.stderr.setEncoding("utf8");
  return child;
}

async function waitForServerReady() {
  const startedAt = Date.now();
  while (Date.now() - startedAt < 60000) {
    try {
      const res = await fetchOk(`${BASE}/robots.txt`, "GET");
      if (res.ok) return;
    } catch {
      // ignore
    }
    await delay(500);
  }
  throw new Error(`Server not ready at ${BASE} within 60s`);
}

async function main() {
  const nextDir = ".next";
  try {
    await fs.access(nextDir);
  } catch {
    throw new Error("Missing .next build output. Run `npm run build` first.");
  }

  const server = startNextServer();
  const stop = async () => {
    if (!server.killed) server.kill();
  };
  process.on("SIGINT", stop);
  process.on("SIGTERM", stop);

  try {
    await waitForServerReady();

    const sitemapRes = await fetchOk(`${BASE}/sitemap.xml`, "GET");
    if (!sitemapRes.ok) {
      throw new Error(`Failed to fetch sitemap.xml: ${sitemapRes.status}`);
    }
    const sitemapXml = await sitemapRes.text();
    let pageUrls = extractUrlsFromSitemap(sitemapXml, BASE);
    if (SAMPLE_LIMIT && Number.isFinite(SAMPLE_LIMIT)) {
      pageUrls = pageUrls.slice(0, SAMPLE_LIMIT);
    }

    const pageFailures = [];
    const assetFailures = [];

    const pageResults = await runPool(
      pageUrls,
      async (url) => {
        try {
          const res = await fetchOk(url, "GET");
          const ok = res.status >= 200 && res.status < 400;
          const contentType = res.headers.get("content-type") || "";
          const html = contentType.includes("text/html") ? await res.text() : null;
          return { url, status: res.status, ok, html };
        } catch (e) {
          return { url, status: 0, ok: false, error: String(e), html: null };
        }
      },
      CONCURRENCY,
    );

    const htmlPages = pageResults.filter((r) => r.html);
    for (const r of pageResults) {
      if (!r.ok) pageFailures.push(r);
    }

    const assetUrls = [];
    for (const p of htmlPages) {
      assetUrls.push(
        ...extractAssetUrlsFromHtml(p.html, p.url).filter((u) => {
          const parsed = new URL(u);
          return parsed.origin === new URL(BASE).origin;
        }),
      );
    }
    const uniqAssets = [...new Set(assetUrls)];

    const assetResults = await runPool(
      uniqAssets,
      async (url) => {
        try {
          const res = await fetchOk(url, "HEAD");
          const ok = res.status >= 200 && res.status < 400;
          return { url, status: res.status, ok };
        } catch (e) {
          return { url, status: 0, ok: false, error: String(e) };
        }
      },
      CONCURRENCY,
    );

    for (const r of assetResults) {
      if (!r.ok) assetFailures.push(r);
    }

    const report = {
      base: BASE,
      pagesChecked: pageUrls.length,
      assetsChecked: uniqAssets.length,
      pageFailures: pageFailures.map((f) => ({
        path: normalizeToPath(f.url),
        status: f.status,
        error: f.error,
      })),
      assetFailures: assetFailures.map((f) => ({
        path: normalizeToPath(f.url),
        status: f.status,
        error: f.error,
      })),
    };

    await fs.mkdir("reports", { recursive: true });
    await fs.writeFile(
      "reports/audit-sitemap.json",
      JSON.stringify(report, null, 2) + "\n",
      "utf8",
    );

    const failureCount = report.pageFailures.length + report.assetFailures.length;
    if (failureCount) {
      console.error(
        `Audit found ${report.pageFailures.length} page failures and ${report.assetFailures.length} asset failures.`,
      );
      console.error("Report: reports/audit-sitemap.json");
      process.exitCode = 1;
    } else {
      console.log(
        `Audit OK: ${report.pagesChecked} pages, ${report.assetsChecked} assets checked.`,
      );
      console.log("Report: reports/audit-sitemap.json");
    }
  } finally {
    await stop();
  }
}

await main();
