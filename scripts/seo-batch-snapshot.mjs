import fs from "node:fs/promises";
import path from "node:path";

function parseArgs(argv) {
  const out = { batchDir: null, audit: null, name: "after" };
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === "--batchDir") out.batchDir = argv[i + 1];
    if (a === "--audit") out.audit = argv[i + 1];
    if (a === "--name") out.name = argv[i + 1];
  }
  return out;
}

function pickSnapshot(page) {
  return {
    url: page.url,
    finalUrl: page.finalUrl,
    status: page.status,
    title: page.title,
    description: page.description,
    canonical: page.canonical,
    robots: page.robots,
    noindex: page.noindex,
    mainContentWords: page.mainContentWords,
    infoPoints: page.infoPoints,
    schemaTypes: page.schema?.parsedTypes || [],
    sample: page.mainContentSample,
  };
}

function diff(before, after) {
  const fields = [
    "finalUrl",
    "status",
    "title",
    "description",
    "canonical",
    "robots",
    "noindex",
    "mainContentWords",
    "infoPoints",
  ];
  const changes = [];
  for (const f of fields) {
    if (JSON.stringify(before?.[f]) !== JSON.stringify(after?.[f])) {
      changes.push({ field: f, before: before?.[f] ?? null, after: after?.[f] ?? null });
    }
  }
  return changes;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.batchDir) throw new Error("Missing --batchDir");
  if (!args.audit) throw new Error("Missing --audit");

  const planPath = path.join(args.batchDir, "plan.json");
  const beforePath = path.join(args.batchDir, "before.json");

  const plan = JSON.parse(await fs.readFile(planPath, "utf8"));
  const audit = JSON.parse(await fs.readFile(args.audit, "utf8"));

  const urlSet = new Set(plan.urls || []);
  const pages = audit.pages || [];
  const pageByUrl = new Map(pages.map((p) => [p.url, p]));

  const snapshot = [];
  for (const url of plan.urls || []) {
    const p = pageByUrl.get(url);
    snapshot.push(p ? pickSnapshot(p) : { url });
  }

  const snapshotPath = path.join(args.batchDir, `${args.name}.json`);
  await fs.writeFile(snapshotPath, JSON.stringify(snapshot, null, 2) + "\n", "utf8");

  let before = null;
  try {
    before = JSON.parse(await fs.readFile(beforePath, "utf8"));
  } catch {
    // ignore
  }

  const byUrlBefore = new Map((before || []).map((x) => [x.url, x]));
  const byUrlAfter = new Map(snapshot.map((x) => [x.url, x]));
  const changeLog = [];
  for (const url of urlSet) {
    const b = byUrlBefore.get(url);
    const a = byUrlAfter.get(url);
    const changes = diff(b, a);
    if (changes.length) {
      changeLog.push({
        url,
        changedAt: new Date().toISOString(),
        changes,
      });
    }
  }
  const changePath = path.join(args.batchDir, "changes.json");
  await fs.writeFile(changePath, JSON.stringify(changeLog, null, 2) + "\n", "utf8");

  console.log(`Wrote: ${snapshotPath}`);
  console.log(`Wrote: ${changePath}`);
}

await main();

