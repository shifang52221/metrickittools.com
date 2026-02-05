import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://metrickittools.com").replace(
  /\/$/,
  "",
);

const staticRoutes = ["/", "/about", "/privacy", "/terms", "/contact", "/guides", "/glossary"];

function readText(relPath) {
  return fs.readFileSync(path.join(root, relPath), "utf8");
}

function extractSection(text, startMarker, endMarker) {
  const startIdx = text.indexOf(startMarker);
  if (startIdx === -1) return "";
  const sliced = text.slice(startIdx + startMarker.length);
  const endIdx = sliced.indexOf(endMarker);
  if (endIdx === -1) return sliced;
  return sliced.slice(0, endIdx);
}

function parseCategories(definitions) {
  const section = extractSection(definitions, "export const categories", "export const calculators");
  const slugs = new Set();
  const regex = /slug:\s*"([^"]+)"/g;
  let match;
  while ((match = regex.exec(section))) {
    slugs.add(match[1]);
  }
  return [...slugs];
}

function parseCalculators(definitions) {
  const lines = definitions.split(/\r?\n/);
  const results = [];
  let inCalc = false;
  let depth = 0;
  let slug = null;
  let category = null;
  for (const line of lines) {
    if (!inCalc && line.includes("export const calculators")) {
      inCalc = true;
      continue;
    }
    if (!inCalc) continue;
    if (line.trim().startsWith("];") && depth === 0) break;
    const clean = stripStrings(line);
    const open = (clean.match(/{/g) || []).length;
    const close = (clean.match(/}/g) || []).length;
    if (depth === 0 && open > 0) {
      slug = null;
      category = null;
    }
    if (depth >= 1 || open > 0) {
      const slugMatch = line.match(/slug:\s*"([^"]+)"/);
      if (slugMatch && depth === 1) slug = slugMatch[1];
      const catMatch = line.match(/category:\s*"([^"]+)"/);
      if (catMatch && depth === 1) category = catMatch[1];
    }
    depth += open - close;
    if (depth === 0 && slug && category) {
      results.push({ slug, category });
      slug = null;
      category = null;
    }
  }
  return results;
}

function parseGuides(guidesText) {
  const lines = guidesText.split(/\r?\n/);
  const results = [];
  let inGuides = false;
  let depth = 0;
  let slug = null;
  let updatedAt = null;
  for (const line of lines) {
    if (!inGuides && line.includes("export const guides")) {
      inGuides = true;
      continue;
    }
    if (!inGuides) continue;
    if (line.trim().startsWith("];") && depth === 0) break;
    const clean = stripStrings(line);
    const open = (clean.match(/{/g) || []).length;
    const close = (clean.match(/}/g) || []).length;
    if (depth === 0 && open > 0) {
      slug = null;
      updatedAt = null;
    }
    if (depth >= 1 || open > 0) {
      const slugMatch = line.match(/^ {4}slug:\s*"([^"]+)"/);
      if (slugMatch && depth === 1) slug = slugMatch[1];
      const updatedMatch = line.match(/^ {4}updatedAt:\s*"([^"]+)"/);
      if (updatedMatch && depth === 1) updatedAt = updatedMatch[1];
    }
    depth += open - close;
    if (depth === 0 && slug) {
      results.push({ slug, updatedAt });
      slug = null;
      updatedAt = null;
    }
  }
  return results;
}

function parseGlossaryTerms(text) {
  const lines = text.split(/\r?\n/);
  const results = [];
  let inTerms = false;
  let depth = 0;
  let slug = null;
  let updatedAt = null;
  for (const line of lines) {
    if (!inTerms && (line.includes("const seeds") || line.includes("export const terms"))) {
      inTerms = true;
      continue;
    }
    if (!inTerms) continue;
    if (line.trim().startsWith("];") && depth === 0) break;
    const clean = stripStrings(line);
    const open = (clean.match(/{/g) || []).length;
    const close = (clean.match(/}/g) || []).length;
    if (depth === 0 && open > 0) {
      slug = null;
      updatedAt = null;
    }
    if (depth >= 1 || open > 0) {
      const slugMatch = line.match(/^ {4}slug:\s*"([^"]+)"/);
      if (slugMatch && depth === 1) slug = slugMatch[1];
      const updatedMatch = line.match(/^ {4}updatedAt:\s*"([^"]+)"/);
      if (updatedMatch && depth === 1) updatedAt = updatedMatch[1];
    }
    depth += open - close;
    if (depth === 0 && slug) {
      results.push({ slug, updatedAt });
      slug = null;
      updatedAt = null;
    }
  }
  return results;
}

function stripStrings(line) {
  return line
    .replace(/"[^"\\]*(?:\\.[^"\\]*)*"/g, "")
    .replace(/'[^'\\]*(?:\\.[^'\\]*)*'/g, "");
}

function toLastMod(value) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString().slice(0, 10);
}

function xmlEscape(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

const definitions = readText("src/lib/calculators/definitions.ts");
const guidesText = readText("src/lib/guides/index.ts");
const glossaryFiles = [
  "src/lib/glossary/terms/core.ts",
  "src/lib/glossary/terms/saas.ts",
  "src/lib/glossary/terms/paidAds.ts",
  "src/lib/glossary/terms/finance.ts",
  "src/lib/glossary/terms/paidAdsExtra.ts",
  "src/lib/glossary/terms/saasExtra.ts",
  "src/lib/glossary/terms/financeExtra.ts",
];

const categories = parseCategories(definitions);
const calculators = parseCalculators(definitions);
const guides = parseGuides(guidesText);
const glossaryTerms = glossaryFiles.flatMap((file) =>
  parseGlossaryTerms(readText(file)),
);

const urls = [];

for (const pathName of staticRoutes) {
  urls.push({ loc: pathName === "/" ? siteUrl : `${siteUrl}${pathName}` });
}

for (const slug of categories) {
  urls.push({ loc: `${siteUrl}/${slug}` });
}

for (const calc of calculators) {
  urls.push({ loc: `${siteUrl}/${calc.category}/${calc.slug}` });
}

for (const guide of guides) {
  urls.push({
    loc: `${siteUrl}/guides/${guide.slug}`,
    lastmod: toLastMod(guide.updatedAt),
  });
}

for (const term of glossaryTerms) {
  urls.push({
    loc: `${siteUrl}/glossary/${term.slug}`,
    lastmod: toLastMod(term.updatedAt),
  });
}

const xmlLines = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
];

for (const entry of urls) {
  xmlLines.push("  <url>");
  xmlLines.push(`    <loc>${xmlEscape(entry.loc)}</loc>`);
  if (entry.lastmod) {
    xmlLines.push(`    <lastmod>${entry.lastmod}</lastmod>`);
  }
  xmlLines.push("  </url>");
}

xmlLines.push("</urlset>");

const publicDir = path.join(root, "public");
fs.mkdirSync(publicDir, { recursive: true });
fs.writeFileSync(path.join(publicDir, "sitemap.xml"), xmlLines.join("\n") + "\n");

const robotsText = [
  "User-agent: *",
  "Allow: /",
  "Disallow: /reports",
  "Disallow: /search",
  "Disallow: /search?",
  `Sitemap: ${siteUrl}/sitemap.xml`,
  "",
].join("\n");

fs.writeFileSync(path.join(publicDir, "robots.txt"), robotsText);

console.log(`Generated sitemap.xml with ${urls.length} URLs.`);
