import fs from "node:fs";
import path from "node:path";

const replacements = [
  // Common mojibake sequences (UTF-8 decoded as legacy encoding)
  { from: "Ã·", to: "/" },
  { from: "Ã—", to: "*" },
  { from: "âˆ’", to: "-" },
  { from: "â‰ˆ", to: "~" },
  { from: "â†’", to: "->" },
  { from: "â€™", to: "'" },
  { from: "â€œ", to: "\"" },
  { from: "â€\u009d", to: "\"" },
  { from: "â€”", to: "-" },
  { from: "â€“", to: "-" },
  { from: "â€¦", to: "..." },

  // Normalize unicode punctuation/symbols to ASCII for consistent rendering
  { from: "’", to: "'" },
  { from: "“", to: "\"" },
  { from: "”", to: "\"" },
  { from: "—", to: "-" },
  { from: "–", to: "-" },
  { from: "…", to: "..." },

  // Math symbols
  { from: "÷", to: "/" },
  { from: "×", to: "*" },
  { from: "−", to: "-" },
  { from: "≈", to: "~" },
  { from: "→", to: "->" },
  { from: "≤", to: "<=" },
  { from: "≥", to: ">=" },
];

const files = [
  "src/lib/guides/index.ts",
  "src/lib/glossary/terms/core.ts",
  "src/lib/glossary/terms/finance.ts",
  "src/lib/glossary/terms/financeExtra.ts",
  "src/lib/glossary/terms/paidAds.ts",
  "src/lib/glossary/terms/paidAdsExtra.ts",
  "src/lib/glossary/terms/saas.ts",
  "src/lib/glossary/terms/saasExtra.ts",
];

function applyReplacements(text) {
  let out = text;
  let changed = false;
  const counts = {};

  for (const { from, to } of replacements) {
    const parts = out.split(from);
    if (parts.length <= 1) continue;
    changed = true;
    counts[from] = (counts[from] ?? 0) + (parts.length - 1);
    out = parts.join(to);
  }

  return { out, changed, counts };
}

let changedFiles = 0;

for (const rel of files) {
  const abs = path.resolve(process.cwd(), rel);
  const before = fs.readFileSync(abs, "utf8");
  const { out, changed, counts } = applyReplacements(before);

  if (!changed) continue;
  fs.writeFileSync(abs, out, "utf8");
  changedFiles += 1;

  const summary = Object.entries(counts)
    .map(([k, v]) => `${JSON.stringify(k)}:${v}`)
    .join(" ");
  process.stdout.write(`normalized ${rel} ${summary}\n`);
}

if (changedFiles === 0) {
  process.stdout.write("no changes\n");
}
