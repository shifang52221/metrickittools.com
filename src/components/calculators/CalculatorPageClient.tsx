"use client";

import { useEffect, useMemo, useState } from "react";
import { calculators } from "@/lib/calculators/definitions";
import type { CalculatorDefinition, ResultValue } from "@/lib/calculators/types";
import {
  formatCurrency,
  formatNumber,
  formatPercent,
  toNumber,
} from "@/lib/format";
import { CalculatorCard } from "@/components/site/CalculatorCard";
import Link from "next/link";
import { AdUnit } from "@/components/ads/AdUnit";
import { guides } from "@/lib/guides";
import { getAdSenseSlot } from "@/lib/adsense";

function formatValue(result: ResultValue): string {
  const maxFractionDigits = result.maxFractionDigits ?? 2;
  switch (result.format) {
    case "currency":
      return formatCurrency(result.value, result.currency ?? "USD");
    case "percent":
      return formatPercent(result.value, maxFractionDigits);
    case "multiple":
      return `${formatNumber(result.value, maxFractionDigits)}×`;
    case "months":
      return `${formatNumber(result.value, maxFractionDigits)} months`;
    case "ratio":
      return `${formatNumber(result.value, maxFractionDigits)}:1`;
    case "number":
    default:
      return formatNumber(result.value, maxFractionDigits);
  }
}

function buildInitialState(calc: CalculatorDefinition): Record<string, string> {
  return Object.fromEntries(calc.inputs.map((i) => [i.key, i.defaultValue]));
}

export function CalculatorPageClient({ slug }: { slug: string }) {
  const calc = calculators.find((c) => c.slug === slug);
  const sidebarSlot = getAdSenseSlot("calculatorSidebar");
  const relatedGuides = useMemo(() => {
    if (!calc) return [];
    return guides
      .filter(
        (g) =>
          g.relatedCalculatorSlugs.includes(calc.slug) ||
          g.slug === calc.guideSlug,
      )
      .slice(0, 4);
  }, [calc]);
  const related = useMemo(() => {
    if (!calc) return [];
    return calculators
      .filter((c) => c.category === calc.category && c.slug !== calc.slug)
      .slice(0, 6);
  }, [calc]);

  const [rawInputs, setRawInputs] = useState<Record<string, string>>(() =>
    calc ? buildInitialState(calc) : {},
  );
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "failed">(
    "idle",
  );
  const [copyResultStatus, setCopyResultStatus] = useState<
    "idle" | "copied" | "failed"
  >("idle");

  const defaultExample = useMemo(() => {
    if (!calc) return null;
    const defaults: Record<string, number> = {};
    for (const input of calc.inputs) {
      const parsedValue = toNumber(input.defaultValue);
      if (parsedValue === null) return null;
      defaults[input.key] = parsedValue;
    }
    return { inputs: defaults, result: calc.compute(defaults) };
  }, [calc]);

  const parsed = useMemo(() => {
    if (!calc) return { values: {}, invalidKeys: [] as string[] };
    const values: Record<string, number> = {};
    const invalidKeys: string[] = [];
    for (const input of calc.inputs) {
      const parsedValue = toNumber(rawInputs[input.key] ?? "");
      if (parsedValue === null) invalidKeys.push(input.key);
      else values[input.key] = parsedValue;
    }
    return { values, invalidKeys };
  }, [calc, rawInputs]);

  const result = useMemo(() => {
    if (!calc) return null;
    if (parsed.invalidKeys.length > 0) return null;
    return calc.compute(parsed.values);
  }, [calc, parsed.invalidKeys.length, parsed.values]);

  useEffect(() => {
    if (!calc) return;
    const url = new URL(window.location.href);
    const nextRaw: Record<string, string> = {};
    for (const input of calc.inputs) {
      const v = url.searchParams.get(input.key);
      if (v !== null) {
        nextRaw[input.key] = v;
      }
    }
    setRawInputs(() => ({
      ...buildInitialState(calc),
      ...nextRaw,
    }));
    // only on first client render per slug
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  if (!calc) {
    return (
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">
          Calculator not found
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          This calculator does not exist.
        </p>
      </div>
    );
  }

  const copyShareLink = async () => {
    try {
      const url = new URL(window.location.href);
      url.search = "";
      for (const input of calc.inputs) {
        const raw = (rawInputs[input.key] ?? "").trim();
        if (raw) url.searchParams.set(input.key, raw);
      }
      await navigator.clipboard.writeText(url.toString());
      setCopyStatus("copied");
      window.setTimeout(() => setCopyStatus("idle"), 1500);
    } catch {
      setCopyStatus("failed");
      window.setTimeout(() => setCopyStatus("idle"), 2000);
    }
  };

  const copyResult = async () => {
    try {
      const headline = result ? formatValue(result.headline) : "";
      const lines: string[] = [];
      lines.push(`${calc.title}: ${headline}`);
      for (const input of calc.inputs) {
        lines.push(`${input.label}: ${rawInputs[input.key] ?? ""}${input.suffix ?? ""}`);
      }
      await navigator.clipboard.writeText(lines.join("\n"));
      setCopyResultStatus("copied");
      window.setTimeout(() => setCopyResultStatus("idle"), 1500);
    } catch {
      setCopyResultStatus("failed");
      window.setTimeout(() => setCopyResultStatus("idle"), 2000);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-5">
      <section className="space-y-4 lg:col-span-3">
        <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          {calc.title}
        </h1>
        <p className="text-pretty text-zinc-600 dark:text-zinc-400">
          {calc.description}
        </p>
        {calc.guideSlug ? (
          <div className="text-sm text-zinc-600 dark:text-zinc-400">
            Prefer an explanation? Read the{" "}
            <Link className="underline" href={`/guides/${calc.guideSlug}`}>
              guide
            </Link>
            .
          </div>
        ) : null}
        {relatedGuides.length ? (
          <div className="flex flex-wrap gap-2 pt-1">
            {relatedGuides.map((g) => (
              <Link
                key={g.slug}
                href={`/guides/${g.slug}`}
                className="rounded-full border border-zinc-200 px-3 py-1 text-sm hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
              >
                {g.title}
              </Link>
            ))}
          </div>
        ) : null}

        <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-black">
          <div className="grid gap-4 sm:grid-cols-2">
            {calc.inputs.map((input) => {
              const isInvalid = parsed.invalidKeys.includes(input.key);
              const helperText = isInvalid
                ? "Enter a valid number."
                : input.help ?? "";
              return (
                <div key={input.key} className="space-y-1">
                  <label className="text-sm font-medium" htmlFor={input.key}>
                    {input.label}
                  </label>
                  <div
                    className={[
                      "min-h-4 text-xs",
                      isInvalid ? "text-red-600" : "text-zinc-500",
                    ].join(" ")}
                  >
                    {helperText || "\u00A0"}
                  </div>
                  <div className="relative">
                    {input.prefix ? (
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-sm text-zinc-500">
                        {input.prefix}
                      </div>
                    ) : null}
                    <input
                      id={input.key}
                      name={input.key}
                      aria-invalid={isInvalid}
                      inputMode="decimal"
                      min={input.min}
                      step={input.step}
                      value={rawInputs[input.key] ?? ""}
                      onChange={(e) =>
                        setRawInputs((prev) => ({
                          ...prev,
                          [input.key]: e.target.value,
                        }))
                      }
                      placeholder={input.placeholder}
                      className={[
                        "w-full rounded-xl border bg-white py-2 text-sm outline-none transition-colors dark:bg-black",
                        "pl-10 pr-12",
                        isInvalid
                          ? "border-red-400 focus:border-red-500"
                          : "border-zinc-200 focus:border-zinc-400 dark:border-zinc-800 dark:focus:border-zinc-600",
                      ].join(" ")}
                    />
                    {input.suffix ? (
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-sm text-zinc-500">
                        {input.suffix}
                      </div>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs text-zinc-500">
              Tip: you can type commas (e.g., 10,000).
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setRawInputs(buildInitialState(calc))}
                className="rounded-full border border-zinc-200 px-3 py-1.5 text-sm hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={copyShareLink}
                className="rounded-full border border-zinc-200 px-3 py-1.5 text-sm hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
              >
                {copyStatus === "copied"
                  ? "Copied"
                  : copyStatus === "failed"
                    ? "Copy failed"
                    : "Copy link"}
              </button>
              <button
                type="button"
                onClick={() => setRawInputs((v) => ({ ...v }))}
                className="rounded-full bg-black px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
              >
                Calculate
              </button>
            </div>
          </div>
        </div>

        {defaultExample ? (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold tracking-tight">Example</h2>
            <div className="rounded-2xl border border-zinc-200 bg-white p-5 text-sm dark:border-zinc-800 dark:bg-black">
              <div className="text-zinc-600 dark:text-zinc-400">
                Using the default inputs, the result is:
              </div>
              <div className="mt-2 text-2xl font-semibold tracking-tight">
                {formatValue(defaultExample.result.headline)}
              </div>
              <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                {calc.inputs.map((i) => (
                  <div key={i.key} className="rounded-xl border border-zinc-100 p-3 dark:border-zinc-900">
                    <dt className="text-xs text-zinc-500">{i.label}</dt>
                    <dd className="mt-1 font-medium">
                      {i.prefix ?? ""}
                      {formatNumber(defaultExample.inputs[i.key] ?? 0, 2)}
                      {i.suffix ?? ""}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        ) : null}

        <div className="space-y-3">
          <h2 className="text-lg font-semibold tracking-tight">Formula</h2>
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 text-sm dark:border-zinc-800 dark:bg-black">
            <div className="font-medium">{calc.formula}</div>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-zinc-600 dark:text-zinc-400">
              {calc.assumptions.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold tracking-tight">FAQ</h2>
          <div className="space-y-2">
            {calc.faqs.map((f) => (
              <details
                key={f.question}
                className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-black"
              >
                <summary className="cursor-pointer text-sm font-medium">
                  {f.question}
                </summary>
                <div className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                  {f.answer}
                </div>
              </details>
            ))}
          </div>
        </div>

        {calc.guide?.length ? (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold tracking-tight">
              How to interpret
            </h2>
            <div className="space-y-3">
              {calc.guide.map((section) => (
                <div
                  key={section.title}
                  className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-black"
                >
                  <div className="text-sm font-medium">{section.title}</div>
                  <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-zinc-600 dark:text-zinc-400">
                    {section.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {related.length ? (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold tracking-tight">
              Related calculators
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {related.map((c) => (
                <CalculatorCard key={c.slug} calc={c} />
              ))}
            </div>
          </div>
        ) : null}
      </section>

      <aside className="space-y-4 lg:col-span-2">
        <div className="sticky top-6 space-y-4">
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-black">
            <div className="text-sm text-zinc-600 dark:text-zinc-400">
              Result
            </div>
            {result ? (
              <>
                <div className="mt-2 text-3xl font-semibold tracking-tight">
                  {formatValue(result.headline)}
                </div>
                <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  {result.headline.detail}
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={copyResult}
                    className="rounded-full border border-zinc-200 px-3 py-1.5 text-sm hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
                  >
                    {copyResultStatus === "copied"
                      ? "Copied"
                      : copyResultStatus === "failed"
                        ? "Copy failed"
                        : "Copy result"}
                  </button>
                </div>
              </>
            ) : (
              <div className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                Enter valid numbers to calculate.
              </div>
            )}
            {result?.warnings?.length ? (
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-red-600">
                {result.warnings.map((w) => (
                  <li key={w}>{w}</li>
                ))}
              </ul>
            ) : null}
          </div>

          <AdUnit
            slot={sidebarSlot}
          />

          {result?.secondary?.length ? (
            <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-black">
              <div className="text-sm font-medium">Details</div>
              <dl className="mt-3 space-y-3">
                {result.secondary.map((r) => (
                  <div key={r.key} className="flex items-start justify-between gap-4">
                    <dt className="text-sm text-zinc-600 dark:text-zinc-400">
                      {r.label}
                      {r.detail ? (
                        <div className="text-xs text-zinc-500">{r.detail}</div>
                      ) : null}
                    </dt>
                    <dd className="text-sm font-medium">{formatValue(r)}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ) : null}

          {result?.breakdown?.length ? (
            <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-black">
              <div className="text-sm font-medium">Inputs</div>
              <dl className="mt-3 space-y-3">
                {result.breakdown.map((r) => (
                  <div key={r.key} className="flex items-center justify-between gap-4">
                    <dt className="text-sm text-zinc-600 dark:text-zinc-400">
                      {r.label}
                    </dt>
                    <dd className="text-sm font-medium">{formatValue(r)}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ) : null}

          <div className="rounded-2xl border border-zinc-200 bg-white p-5 text-xs text-zinc-600 dark:border-zinc-800 dark:bg-black dark:text-zinc-400">
            Disclaimer: This tool provides estimates for informational purposes
            only and does not constitute financial, accounting, or legal advice.
          </div>
        </div>
      </aside>
    </div>
  );
}
