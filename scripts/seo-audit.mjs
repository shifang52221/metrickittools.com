import { spawn } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";
import process from "node:process";
import fs from "node:fs/promises";

const BASE = process.env.SEO_AUDIT_BASE_URL || "http://127.0.0.1:3000";
const PREFERRED_SITE_URL =
  process.env.SEO_PREFERRED_SITE_URL || "https://metrickittools.com";
const CONCURRENCY = Number(process.env.SEO_AUDIT_CONCURRENCY || 15);
const TIMEOUT_MS = Number(process.env.SEO_AUDIT_TIMEOUT_MS || 20000);
const MAX_REDIRECTS = Number(process.env.SEO_AUDIT_MAX_REDIRECTS || 10);
const MAX_CRAWL_PAGES = Number(process.env.SEO_AUDIT_MAX_CRAWL_PAGES || 2000);
const VERY_SHORT_WORDS = Number(process.env.SEO_VERY_SHORT_WORDS || 80);
const MIN_INFO_POINTS = Number(process.env.SEO_MIN_INFO_POINTS || 8);

function nowStamp() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return (
    d.getFullYear() +
    pad(d.getMonth() + 1) +
    pad(d.getDate()) +
    "-" +
    pad(d.getHours()) +
    pad(d.getMinutes()) +
    pad(d.getSeconds())
  );
}

function normalizeUrl(urlString) {
  const u = new URL(urlString);
  u.hash = "";
  return u.toString();
}

function normalizePath(urlString) {
  const u = new URL(urlString);
  return u.pathname.replace(/\/+$/, "") || "/";
}

function sameOrigin(a, b) {
  return new URL(a).origin === new URL(b).origin;
}

function stripTags(html) {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractBetween(html, startRe, endRe) {
  const start = html.search(startRe);
  if (start < 0) return null;
  const rest = html.slice(start);
  const endMatch = rest.match(endRe);
  if (!endMatch) return rest;
  const endIdx = endMatch.index;
  return rest.slice(0, endIdx + endMatch[0].length);
}

function extractTitle(html) {
  const m = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return m ? stripTags(m[1]).trim() : null;
}

function extractMetaContent(html, name) {
  const re = new RegExp(
    `<meta[^>]+name=["']${name}["'][^>]*content=["']([^"']+)["'][^>]*>`,
    "i",
  );
  const m = html.match(re);
  if (m) return m[1].trim();
  const re2 = new RegExp(
    `<meta[^>]+content=["']([^"']+)["'][^>]*name=["']${name}["'][^>]*>`,
    "i",
  );
  const m2 = html.match(re2);
  return m2 ? m2[1].trim() : null;
}

function extractLinkHref(html, rel) {
  const re = new RegExp(
    `<link[^>]+rel=["']${rel}["'][^>]*href=["']([^"']+)["'][^>]*>`,
    "i",
  );
  const m = html.match(re);
  if (m) return m[1].trim();
  const re2 = new RegExp(
    `<link[^>]+href=["']([^"']+)["'][^>]*rel=["']${rel}["'][^>]*>`,
    "i",
  );
  const m2 = html.match(re2);
  return m2 ? m2[1].trim() : null;
}

function extractHreflangs(html, pageUrl) {
  const out = [];
  for (const m of html.matchAll(
    /<link[^>]+rel=["']alternate["'][^>]*>/gi,
  )) {
    const tag = m[0];
    const href = (tag.match(/href=["']([^"']+)["']/i) || [])[1];
    const hreflang = (tag.match(/hreflang=["']([^"']+)["']/i) || [])[1];
    if (!href || !hreflang) continue;
    try {
      out.push({
        hreflang: hreflang.trim(),
        href: new URL(href.trim(), pageUrl).toString(),
      });
    } catch {
      // ignore
    }
  }
  return out;
}

function extractInternalLinks(html, pageUrl, baseOrigin) {
  const links = [];
  for (const m of html.matchAll(/<a\b[^>]*href=["']([^"'#]+)["'][^>]*>/gi)) {
    const raw = m[1].trim();
    if (!raw) continue;
    if (raw.startsWith("mailto:") || raw.startsWith("tel:")) continue;
    if (raw.startsWith("javascript:")) continue;
    try {
      const u = new URL(raw, pageUrl);
      if (u.origin !== baseOrigin) continue;
      u.hash = "";
      links.push(u.toString());
    } catch {
      // ignore
    }
  }
  return [...new Set(links)];
}

function extractJsonLd(html) {
  const blocks = [];
  for (const m of html.matchAll(
    /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
  )) {
    blocks.push(m[1].trim());
  }
  const parsed = [];
  const errors = [];
  for (const raw of blocks) {
    if (!raw) continue;
    try {
      parsed.push(JSON.parse(raw));
    } catch (e) {
      errors.push({ error: String(e), snippet: raw.slice(0, 220) });
    }
  }
  return { count: blocks.length, parsed, errors };
}

function mainTextWords(html) {
  const main =
    extractBetween(html, /<main\b/i, /<\/main>/i) ||
    extractBetween(html, /<body\b/i, /<\/body>/i) ||
    html;

  const cleaned = main
    .replace(/<header\b[^>]*>[\s\S]*?<\/header>/gi, " ")
    .replace(/<nav\b[^>]*>[\s\S]*?<\/nav>/gi, " ")
    .replace(/<footer\b[^>]*>[\s\S]*?<\/footer>/gi, " ");

  const text = stripTags(cleaned);
  const words = text.match(/[A-Za-z0-9]+/g) || [];
  return { words: words.length, sample: text.slice(0, 240) };
}

function extractInfoPoints(html) {
  const main =
    extractBetween(html, /<main\b/i, /<\/main>/i) ||
    extractBetween(html, /<body\b/i, /<\/body>/i) ||
    html;

  const cleaned = main
    .replace(/<header\b[^>]*>[\s\S]*?<\/header>/gi, " ")
    .replace(/<nav\b[^>]*>[\s\S]*?<\/nav>/gi, " ")
    .replace(/<footer\b[^>]*>[\s\S]*?<\/footer>/gi, " ");

  const h2 = (cleaned.match(/<h2\b/gi) || []).length;
  const h3 = (cleaned.match(/<h3\b/gi) || []).length;
  const li = (cleaned.match(/<li\b/gi) || []).length;
  const tr = (cleaned.match(/<tr\b/gi) || []).length;

  const paragraphs = [];
  for (const m of cleaned.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)) {
    const text = stripTags(m[1]);
    const words = (text.match(/[A-Za-z0-9]+/g) || []).length;
    if (words >= 8) paragraphs.push(text);
  }

  return {
    points: h2 + h3 + li + Math.max(0, tr - 1) + paragraphs.length,
    breakdown: { h2, h3, li, tr: Math.max(0, tr - 1), p: paragraphs.length },
  };
}

function classify(urlString) {
  const path = normalizePath(urlString);
  if (
    [
      "/",
      "/about",
      "/contact",
      "/privacy",
      "/terms",
      "/guides",
      "/glossary",
      "/search",
      "/robots.txt",
      "/sitemap.xml",
    ].includes(path)
  ) {
    return "static";
  }
  if (path === "/paid-ads" || path === "/saas-metrics" || path === "/finance") {
    return "category";
  }
  if (path.startsWith("/guides/")) return "guide";
  if (path.startsWith("/glossary/")) return "resource";
  if (/(^|\/)[^/]+-calculator$/.test(path)) return "calculator";
  if (/^\/(paid-ads|saas-metrics|finance)\/[^/]+$/.test(path)) return "calculator";
  return "resource";
}

async function fetchWithRedirects(url, preferredMethod = "GET") {
  const chain = [];
  let current = url;
  for (let i = 0; i < MAX_REDIRECTS; i += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
    let res;
    try {
      res = await fetch(current, {
        method: preferredMethod,
        redirect: "manual",
        signal: controller.signal,
        headers: {
          "User-Agent": "metrickittools-seo-audit/1.0",
          Accept: "text/html,application/xml;q=0.9,*/*;q=0.8",
        },
      });
    } finally {
      clearTimeout(timeout);
    }
    chain.push({ url: current, status: res.status });
    const location = res.headers.get("location");
    const isRedirect = res.status >= 300 && res.status < 400 && location;
    if (!isRedirect) return { res, chain, finalUrl: current };
    current = new URL(location, current).toString();
    preferredMethod = "GET";
  }
  return { res: null, chain, finalUrl: current, error: "redirect loop" };
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
  const nextBin = "node_modules/next/dist/bin/next";
  const child = spawn(process.execPath, [nextBin, "start", "-p", "3000"], {
    stdio: ["ignore", "pipe", "pipe"],
    env: { ...process.env, PORT: "3000" },
    shell: false,
  });
  child.stdout.setEncoding("utf8");
  child.stderr.setEncoding("utf8");
  return child;
}

async function waitForServerReady(base) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < 60000) {
    try {
      const { res } = await fetchWithRedirects(new URL("/robots.txt", base).toString());
      if (res && res.ok) return;
    } catch {
      // ignore
    }
    await delay(500);
  }
  throw new Error(`Server not ready at ${base} within 60s`);
}

async function crawlInternal(startUrls) {
  const visited = new Set();
  const queue = startUrls.slice();
  while (queue.length && visited.size < MAX_CRAWL_PAGES) {
    const url = queue.shift();
    if (visited.has(url)) continue;
    visited.add(url);
    // Only enqueue via sitemap fetch pipeline; here we just collect seeds.
    // Internal link discovery happens after page fetch to avoid double-fetching.
  }
  return [...visited];
}

function preferredCanonicalFor(urlString) {
  const u = new URL(urlString);
  const preferred = new URL(PREFERRED_SITE_URL);
  preferred.pathname = u.pathname;
  preferred.search = "";
  preferred.hash = "";
  return preferred.toString();
}

function resolveCanonical(raw, pageUrl) {
  if (!raw) return null;
  try {
    return new URL(raw, pageUrl).toString();
  } catch {
    return null;
  }
}

function parseRobotsFromHeader(res) {
  const x = res?.headers?.get?.("x-robots-tag");
  return x ? x.trim() : null;
}

function hasNoindex(robots) {
  if (!robots) return false;
  return robots.toLowerCase().split(",").map((s) => s.trim()).includes("noindex");
}

function hamming64(a, b) {
  let x = a ^ b;
  let c = 0;
  while (x) {
    c += Number(x & 1n);
    x >>= 1n;
  }
  return c;
}

function simhash64(text) {
  const tokens = (text.toLowerCase().match(/[a-z0-9]{2,}/g) || []).slice(0, 5000);
  if (!tokens.length) return 0n;
  const weights = new Map();
  for (const t of tokens) weights.set(t, (weights.get(t) || 0) + 1);
  const vec = Array(64).fill(0);
  for (const [t, w] of weights) {
    let h = 1469598103934665603n; // FNV-1a 64-bit offset
    for (let i = 0; i < t.length; i += 1) {
      h ^= BigInt(t.charCodeAt(i));
      h = (h * 1099511628211n) & ((1n << 64n) - 1n);
    }
    for (let i = 0; i < 64; i += 1) {
      const bit = (h >> BigInt(i)) & 1n;
      vec[i] += bit ? w : -w;
    }
  }
  let out = 0n;
  for (let i = 0; i < 64; i += 1) {
    if (vec[i] > 0) out |= 1n << BigInt(i);
  }
  return out;
}

function pageKey(urlString) {
  return normalizePath(urlString);
}

async function main() {
  const base = new URL(BASE);
  const baseOrigin = base.origin;
  const preferredOrigin = new URL(PREFERRED_SITE_URL).origin;

  const isLocal = baseOrigin === "http://127.0.0.1:3000";
  let server = null;

  if (isLocal) {
    try {
      await fs.access(".next");
    } catch {
      throw new Error("Missing .next build output. Run `npm run build` first.");
    }
    server = startNextServer();
    const stop = async () => {
      if (server && !server.killed) server.kill();
    };
    process.on("SIGINT", stop);
    process.on("SIGTERM", stop);
    await waitForServerReady(BASE);
  }

  const startedAt = Date.now();
  try {
    const { res: sitemapRes } = await fetchWithRedirects(
      new URL("/sitemap.xml", BASE).toString(),
      "GET",
    );
    if (!sitemapRes || !sitemapRes.ok) {
      throw new Error(`Failed to fetch sitemap.xml: ${sitemapRes?.status ?? 0}`);
    }
    const sitemapXml = await sitemapRes.text();
    const sitemapUrls = extractUrlsFromSitemap(sitemapXml, BASE);

    const seedCrawl = await crawlInternal([
      new URL("/", BASE).toString(),
      new URL("/guides", BASE).toString(),
      new URL("/glossary", BASE).toString(),
    ]);
    const targetUrls = [...new Set([...sitemapUrls, ...seedCrawl])];

    const pages = await runPool(
      targetUrls,
      async (url) => {
        try {
          const { res, chain, finalUrl } = await fetchWithRedirects(url, "GET");
          if (!res) {
            return { url, status: 0, finalUrl, redirectChain: chain, ok: false, error: "fetch failed" };
          }
          const contentType = res.headers.get("content-type") || "";
          const isHtml = contentType.includes("text/html");
          const html = isHtml ? await res.text() : null;
          const headerRobots = parseRobotsFromHeader(res);
          const title = html ? extractTitle(html) : null;
          const description = html ? extractMetaContent(html, "description") : null;
          const robotsMeta = html ? extractMetaContent(html, "robots") : null;
          const canonicalRaw = html ? extractLinkHref(html, "canonical") : null;
          const canonical = html ? resolveCanonical(canonicalRaw, finalUrl) : null;
          const hreflang = html ? extractHreflangs(html, finalUrl) : [];
          const internalLinks = html
            ? extractInternalLinks(html, finalUrl, baseOrigin)
            : [];
          const main = html ? mainTextWords(html) : { words: 0, sample: "" };
          const info = html
            ? extractInfoPoints(html)
            : { points: 0, breakdown: { h2: 0, h3: 0, li: 0, tr: 0, p: 0 } };
          const schema = html ? extractJsonLd(html) : { count: 0, parsed: [], errors: [] };

          const canonicalExpected = preferredCanonicalFor(finalUrl);
          const canonicalMismatch =
            canonical && normalizeUrl(canonical) !== normalizeUrl(canonicalExpected);

          const robotsCombined = [robotsMeta, headerRobots].filter(Boolean).join(" | ") || null;
          const noindex = hasNoindex(robotsMeta) || hasNoindex(headerRobots);

          const mainTextSample = html ? stripTags(extractBetween(html, /<main\b/i, /<\/main>/i) || html).slice(0, 800) : "";
          const hash = html ? simhash64(mainTextSample) : 0n;

          return {
            url,
            type: classify(finalUrl),
            status: res.status,
            ok: res.status >= 200 && res.status < 400,
            finalUrl,
            redirectChain: chain,
            title,
            description,
            canonical,
            canonicalExpected,
            canonicalMismatch,
            robots: robotsCombined,
            noindex,
            hreflang,
            mainContentWords: main.words,
            mainContentSample: main.sample,
            infoPoints: info.points,
            infoPointsBreakdown: info.breakdown,
            internalLinks: internalLinks.map(normalizeUrl),
            schema: {
              count: schema.count,
              parsedTypes: schema.parsed
                .map((x) => (x && typeof x === "object" ? x["@type"] : null))
                .filter(Boolean),
              errors: schema.errors,
            },
            hash: hash.toString(),
          };
        } catch (e) {
          return { url, status: 0, finalUrl: url, ok: false, error: String(e) };
        }
      },
      CONCURRENCY,
    );

    const byPath = new Map(pages.map((p) => [pageKey(p.finalUrl || p.url), p]));

    // Build link graph
    const inbound = new Map();
    for (const p of pages) {
      for (const to of p.internalLinks || []) {
        if (!sameOrigin(to, BASE) && !sameOrigin(to, PREFERRED_SITE_URL)) continue;
        const key = pageKey(to);
        inbound.set(key, (inbound.get(key) || 0) + 1);
      }
    }

    const issues = {
      non200: [],
      redirectChains: [],
      canonicalMismatch: [],
      noindexInSitemap: [],
      duplicateTitle: [],
      duplicateDescription: [],
      veryShort: [],
      orphan: [],
      badLinks: [],
      schemaErrors: [],
      hreflangErrors: [],
      nearDuplicate: [],
    };

    const sitemapSet = new Set(sitemapUrls.map(pageKey));

    for (const p of pages) {
      const key = pageKey(p.finalUrl || p.url);
      const inSitemap = sitemapSet.has(pageKey(p.url)) || sitemapSet.has(key);
      if (inSitemap && !(p.status >= 200 && p.status < 300)) {
        issues.non200.push({
          url: p.url,
          finalUrl: p.finalUrl,
          status: p.status,
          redirectChain: p.redirectChain,
        });
      }
      if (p.redirectChain && p.redirectChain.length > 2) {
        issues.redirectChains.push({
          url: p.url,
          finalUrl: p.finalUrl,
          chain: p.redirectChain,
        });
      }
      if (p.canonicalMismatch) {
        issues.canonicalMismatch.push({
          url: p.url,
          finalUrl: p.finalUrl,
          canonical: p.canonical,
          expected: p.canonicalExpected,
        });
      }
      if (inSitemap && p.noindex) {
        issues.noindexInSitemap.push({
          url: p.url,
          robots: p.robots,
        });
      }
      if (p.schema?.errors?.length) {
        issues.schemaErrors.push({
          url: p.url,
          errors: p.schema.errors,
        });
      }
      if (p.hreflang?.length) {
        const bad = [];
        for (const h of p.hreflang) {
          if (!/^[a-z]{2}(-[A-Z]{2})?$|^x-default$/i.test(h.hreflang)) {
            bad.push({ ...h, error: "invalid hreflang" });
            continue;
          }
          const hrefOrigin = new URL(h.href).origin;
          if (hrefOrigin !== preferredOrigin) {
            bad.push({ ...h, error: "unexpected host" });
          }
        }
        if (bad.length) issues.hreflangErrors.push({ url: p.url, bad });
      }
      {
        const reasons = [];
        if ((p.mainContentWords ?? 0) < VERY_SHORT_WORDS) reasons.push("lowWords");
        if ((p.infoPoints ?? 0) < MIN_INFO_POINTS) reasons.push("lowInfoPoints");
        if (reasons.length) {
          issues.veryShort.push({
            url: p.url,
            reasons,
            words: p.mainContentWords ?? 0,
            infoPoints: p.infoPoints ?? 0,
            infoPointsBreakdown: p.infoPointsBreakdown,
            sample: p.mainContentSample,
          });
        }
      }

      // bad links (only for links we already crawled)
      for (const to of p.internalLinks || []) {
        const target = byPath.get(pageKey(to));
        if (!target) continue;
        if (!(target.status >= 200 && target.status < 400)) {
          issues.badLinks.push({
            from: p.url,
            to,
            status: target.status,
            finalUrl: target.finalUrl,
          });
        }
      }
    }

    // Orphans: in sitemap but no inbound links
    for (const u of sitemapUrls) {
      const key = pageKey(u);
      const inb = inbound.get(key) || 0;
      if (key === "/") continue;
      if (inb === 0) issues.orphan.push({ url: u });
    }

    // Duplicate title/description
    const titleMap = new Map();
    const descMap = new Map();
    for (const p of pages) {
      if (!p.title) continue;
      const k = p.title.trim();
      titleMap.set(k, [...(titleMap.get(k) || []), p.url]);
    }
    for (const p of pages) {
      if (!p.description) continue;
      const k = p.description.trim();
      descMap.set(k, [...(descMap.get(k) || []), p.url]);
    }
    for (const [k, urls] of titleMap) {
      if (urls.length > 1) issues.duplicateTitle.push({ title: k, urls });
    }
    for (const [k, urls] of descMap) {
      if (urls.length > 1) issues.duplicateDescription.push({ description: k, urls });
    }

    // Near-duplicate clusters via simhash hamming distance
    // The stored hash is decimal string; use BigInt directly
    const hashes = pages
      .filter((p) => p.hash && p.mainContentWords > 0)
      .map((p) => ({ url: p.url, type: p.type, hash: BigInt(p.hash) }));
    const pairs = [];
    for (let i = 0; i < hashes.length; i += 1) {
      for (let j = i + 1; j < hashes.length; j += 1) {
        if (hashes[i].type !== hashes[j].type) continue;
        const d = hamming64(hashes[i].hash, hashes[j].hash);
        if (d <= 3) pairs.push({ a: hashes[i].url, b: hashes[j].url, d });
      }
    }
    issues.nearDuplicate = pairs.slice(0, 2000);

    // Summaries
    const report = {
      base: BASE,
      preferredSiteUrl: PREFERRED_SITE_URL,
      collectedAt: new Date().toISOString(),
      durationMs: Date.now() - startedAt,
      pages: pages,
      counts: {
        totalTargets: targetUrls.length,
        sitemapUrls: sitemapUrls.length,
        crawled: pages.length,
      },
      issues,
      thresholds: {
        VERY_SHORT_WORDS,
        MIN_INFO_POINTS,
      },
    };

    await fs.mkdir("reports", { recursive: true });
    const stamp = nowStamp();
    const baseSlug = base.host.replace(/[^a-z0-9.-]/gi, "_");
    const jsonPath = `reports/seo-audit-${baseSlug}-${stamp}.json`;
    await fs.writeFile(jsonPath, JSON.stringify(report, null, 2) + "\n", "utf8");

    const lines = [];
    const pushIssue = (name, arr) => {
      lines.push(`## ${name}`);
      lines.push(`count: ${arr.length}`);
      lines.push("");
      for (const item of arr.slice(0, 50)) {
        lines.push(`- ${JSON.stringify(item)}`);
      }
      lines.push("");
    };
    lines.push(`# SEO Audit (${BASE})`);
    lines.push(`preferredSiteUrl: ${PREFERRED_SITE_URL}`);
    lines.push(`checked: ${report.counts.sitemapUrls} sitemap URLs, ${report.counts.totalTargets} total targets`);
    lines.push(`durationMs: ${report.durationMs}`);
    lines.push("");
    pushIssue("non200", issues.non200);
    pushIssue("redirectChains", issues.redirectChains);
    pushIssue("canonicalMismatch", issues.canonicalMismatch);
    pushIssue("noindexInSitemap", issues.noindexInSitemap);
    pushIssue("duplicateTitle", issues.duplicateTitle);
    pushIssue("duplicateDescription", issues.duplicateDescription);
    pushIssue("veryShort", issues.veryShort);
    pushIssue("orphan", issues.orphan);
    pushIssue("badLinks", issues.badLinks);
    pushIssue("schemaErrors", issues.schemaErrors);
    pushIssue("hreflangErrors", issues.hreflangErrors);
    pushIssue("nearDuplicate(pairs<=3)", issues.nearDuplicate);
    const mdPath = `reports/seo-audit-${baseSlug}-${stamp}.md`;
    await fs.writeFile(mdPath, lines.join("\n") + "\n", "utf8");

    const hardFail =
      issues.non200.length ||
      issues.duplicateTitle.length ||
      issues.duplicateDescription.length ||
      issues.canonicalMismatch.length ||
      issues.noindexInSitemap.length ||
      issues.veryShort.length;

    if (hardFail) {
      console.error("SEO audit failed hard requirements.");
      console.error(`Report: ${jsonPath}`);
      console.error(`Report: ${mdPath}`);
      process.exitCode = 1;
    } else {
      console.log("SEO audit OK (hard requirements met).");
      console.log(`Report: ${jsonPath}`);
      console.log(`Report: ${mdPath}`);
    }
  } finally {
    if (server && !server.killed) server.kill();
  }
}

await main();
