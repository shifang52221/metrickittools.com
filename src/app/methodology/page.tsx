import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "MetricKit methodology: formulas, assumptions, and updates" },
  description:
    "See how MetricKit builds calculators and explanatory pages: formulas, assumptions, examples, update rules, and how we handle corrections and sources.",
  alternates: { canonical: "/methodology" },
};

export default function MethodologyPage() {
  return (
    <div className="prose prose-zinc max-w-3xl dark:prose-invert">
      <h1>Methodology</h1>
      <p>
        This page explains how {siteConfig.name} builds calculators, glossary
        entries, and guides. The aim is not to pretend that every business uses
        the same metric definition. The aim is to make assumptions visible so a
        team can decide whether a page matches its own operating model.
      </p>
      <h2>How calculators are built</h2>
      <ul>
        <li>Each calculator uses an explicit formula or compact decision rule.</li>
        <li>Inputs are user-provided; we do not import live account data.</li>
        <li>Outputs are intended for planning, interpretation, and comparison.</li>
        <li>Where a shortcut is used, we try to state the tradeoff clearly.</li>
      </ul>
      <h2>Formula design principles</h2>
      <ul>
        <li>Prefer standard business formulas before introducing custom logic.</li>
        <li>Make units obvious: monthly vs annual, dollars vs percentages, users vs accounts.</li>
        <li>Keep variable names legible so operators can reproduce the result in a model.</li>
        <li>Link to a guide or glossary page when interpretation is more important than the raw math.</li>
      </ul>
      <h2>Examples and worked numbers</h2>
      <p>
        We use worked examples to show how a result moves when one assumption
        changes. Example values are illustrative and should not be treated as
        benchmarks unless the page explicitly says so.
      </p>
      <h2>Assumptions and limits</h2>
      <ul>
        <li>Metric definitions vary by business model, accounting policy, and team convention.</li>
        <li>Some calculators simplify reality to stay useful in a browser workflow.</li>
        <li>Outputs do not replace accounting, finance, legal, or tax advice.</li>
        <li>Attribution and incrementality metrics can diverge from platform reporting.</li>
      </ul>
      <h2>How glossary and guide pages are written</h2>
      <ul>
        <li>Glossary pages define a term, clarify common misuse, and link to practical next steps.</li>
        <li>Guide pages explain when to use a metric, how to interpret it, and what mistakes to avoid.</li>
        <li>We try to connect formulas to operator decisions rather than leaving them as isolated definitions.</li>
      </ul>
      <h2>Corrections and updates</h2>
      <p>
        We revise pages when a formula is unclear, a definition is commonly
        misread, or a better explanation would prevent bad decisions. If a
        change materially affects interpretation, we try to make that visible in
        the linked page set.
      </p>
      <h2>Sources and references</h2>
      <p>
        Not every page currently carries a full source list, but our direction
        is to increase explicit references for benchmark-heavy and definition
        sensitive topics. When you send feedback, including your source or team
        convention helps us evaluate whether a page should be clarified.
      </p>
      <h2>Feedback loop</h2>
      <p>
        If a page is ambiguous, inconsistent, or missing an important use case,
        email <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a> with
        the URL, your business model, and the exact point of confusion.
      </p>
      <p>
        See also: <Link href="/editorial-policy">Editorial Policy</Link>,{" "}
        <Link href="/about">About</Link>, and <Link href="/contact">Contact</Link>.
      </p>
    </div>
  );
}
