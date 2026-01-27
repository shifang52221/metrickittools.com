import fs from "node:fs/promises";
import path from "node:path";

const REPORTS_DIR = "reports";

function parseArgs(argv) {
  const out = { audit: null, batch: null, outDir: null };
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === "--audit") out.audit = argv[i + 1];
    if (a === "--batch") out.batch = argv[i + 1];
    if (a === "--out") out.outDir = argv[i + 1];
  }
  return out;
}

async function latestAuditReport() {
  const entries = await fs.readdir(REPORTS_DIR);
  const files = entries
    .filter((f) => /^seo-audit-.*\.json$/.test(f))
    .map((f) => ({ f, full: path.join(REPORTS_DIR, f) }));
  if (!files.length) return null;
  const stats = await Promise.all(
    files.map(async (x) => ({ ...x, stat: await fs.stat(x.full) })),
  );
  stats.sort((a, b) => b.stat.mtimeMs - a.stat.mtimeMs);
  return stats[0].full;
}

function uniq(arr) {
  return [...new Set(arr)];
}

function normalizeIssueUrls(issueKey, issueItem) {
  if (!issueItem) return [];
  if (typeof issueItem === "string") return [issueItem];
  if (issueKey === "duplicateTitle" || issueKey === "duplicateDescription") {
    return issueItem.urls || [];
  }
  if (issueKey === "badLinks") return issueItem.from ? [issueItem.from] : [];
  if (issueKey === "nearDuplicate") return uniq([issueItem.a, issueItem.b].filter(Boolean));
  return issueItem.url ? [issueItem.url] : [];
}

function buildBatchCandidates(report) {
  const pages = report.pages || [];
  const urlToPage = new Map(pages.map((p) => [p.url, p]));

  const order = [
    "non200",
    "redirectChains",
    "canonicalMismatch",
    "hreflangErrors",
    "noindexInSitemap",
    "duplicateTitle",
    "duplicateDescription",
    "titleMissing",
    "descriptionMissing",
    "titleTooShort",
    "titleTooLong",
    "descriptionTooShort",
    "descriptionTooLong",
    "veryShort",
    "orphan",
    "badLinks",
    "schemaErrors",
    "schemaMismatch",
    "nearDuplicate",
  ];

  const groups = new Map();
  for (const issueKey of order) {
    const raw = report.issues?.[issueKey] || [];
    for (const item of raw) {
      for (const url of normalizeIssueUrls(issueKey, item)) {
        const page = urlToPage.get(url);
        const classification = page?.type || "unknown";
        const k = `${issueKey}::${classification}`;
        groups.set(k, {
          issueType: issueKey,
          classification,
          items: [...(groups.get(k)?.items || []), { url, evidence: item }],
        });
      }
    }
  }

  const out = [];
  for (const issueKey of order) {
    const candidates = [...groups.values()].filter((g) => g.issueType === issueKey);
    candidates.sort((a, b) => b.items.length - a.items.length);
    out.push(...candidates);
  }
  return out;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const auditPath = args.audit || (await latestAuditReport());
  if (!auditPath) throw new Error("No audit report found. Run `node scripts/seo-audit.mjs` first.");

  const raw = await fs.readFile(auditPath, "utf8");
  const report = JSON.parse(raw);

  const candidates = buildBatchCandidates(report);
  const pick = candidates.find((c) => c.items.length > 0);
  if (!pick) {
    console.log("No issues found to batch.");
    return;
  }

  const batchId = args.batch || "001";
  const outDir = args.outDir || path.join(REPORTS_DIR, "batches", `batch-${batchId}`);
  await fs.mkdir(outDir, { recursive: true });

  const urls = uniq(pick.items.map((x) => x.url)).slice(0, 10);
  const urlToPage = new Map((report.pages || []).map((p) => [p.url, p]));

  const before = urls.map((url) => {
    const p = urlToPage.get(url);
    return p
      ? {
          url: p.url,
          finalUrl: p.finalUrl,
          status: p.status,
          title: p.title,
          description: p.description,
          canonical: p.canonical,
          robots: p.robots,
          noindex: p.noindex,
          mainContentWords: p.mainContentWords,
          infoPoints: p.infoPoints,
          schemaTypes: p.schema?.parsedTypes || [],
          sample: p.mainContentSample,
        }
      : { url };
  });

  const plan = {
    batchId,
    createdAt: new Date().toISOString(),
    auditReport: auditPath,
    base: report.base,
    preferredSiteUrl: report.preferredSiteUrl,
    issueType: pick.issueType,
    classification: pick.classification,
    urls,
  };

  await fs.writeFile(path.join(outDir, "plan.json"), JSON.stringify(plan, null, 2) + "\n", "utf8");
  await fs.writeFile(path.join(outDir, "before.json"), JSON.stringify(before, null, 2) + "\n", "utf8");

  const md = [];
  md.push(`# Batch ${batchId}`);
  md.push("");
  md.push(`- issueType: ${plan.issueType}`);
  md.push(`- classification: ${plan.classification}`);
  md.push(`- urls: ${plan.urls.length}`);
  md.push(`- audit: ${auditPath}`);
  md.push("");
  for (const url of urls) md.push(`- ${url}`);
  md.push("");
  await fs.writeFile(path.join(outDir, "plan.md"), md.join("\n") + "\n", "utf8");

  console.log(`Wrote: ${path.join(outDir, "plan.json")}`);
  console.log(`Wrote: ${path.join(outDir, "before.json")}`);
  console.log(`Wrote: ${path.join(outDir, "plan.md")}`);
}

await main();
