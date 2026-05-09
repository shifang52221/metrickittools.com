import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "MetricKit editorial policy: drafting, review, and corrections" },
  description:
    "See how MetricKit drafts, reviews, updates, and corrects calculators, guides, and glossary pages, including how editorial review and feedback are handled.",
  alternates: { canonical: "/editorial-policy" },
};

export default function EditorialPolicyPage() {
  return (
    <div className="prose prose-zinc max-w-3xl dark:prose-invert">
      <h1>Editorial Policy</h1>
      <p>
        {siteConfig.name} uses a brand-editorial workflow. Pages are written by{" "}
        <strong>{siteConfig.editorialTeamName}</strong> and reviewed under the{" "}
        <strong>{siteConfig.reviewTeamName}</strong> process before meaningful
        updates are published.
      </p>
      <h2>What we publish</h2>
      <ul>
        <li>Interactive calculators for SaaS, paid ads, and finance workflows.</li>
        <li>Guides that explain how to interpret metrics and model outputs.</li>
        <li>Glossary pages that define terms and link them to real decisions.</li>
      </ul>
      <h2>Editorial goals</h2>
      <ul>
        <li>Make formulas and assumptions explicit.</li>
        <li>Reduce ambiguity in definitions that teams commonly misuse.</li>
        <li>Prefer practical operator clarity over jargon or filler language.</li>
        <li>Help users move from a metric definition to a decision or next step.</li>
      </ul>
      <h2>Drafting and review</h2>
      <ul>
        <li>New and updated pages are drafted in an editorial workflow before publishing.</li>
        <li>Review checks focus on formula consistency, definition clarity, and decision usefulness.</li>
        <li>Linked calculators, guides, and glossary pages are compared for naming and denominator consistency.</li>
      </ul>
      <h2>Corrections policy</h2>
      <p>
        If a page contains a material mistake or an explanation that could
        mislead users, we aim to correct it and update the page timestamp. If
        you spot an issue, send the page URL and the specific concern to{" "}
        <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.
      </p>
      <h2>Conflicts and commercial independence</h2>
      <p>
        Our goal is to make the content useful before it is monetizable.
        Advertising, sponsorship, or tooling considerations should not override
        formula clarity, definition precision, or correction handling.
      </p>
      <h2>Limitations</h2>
      <ul>
        <li>Metric definitions can vary across industries and internal finance policies.</li>
        <li>Some pages summarize a concept and do not replace professional advice.</li>
        <li>Examples are illustrative unless a page explicitly states otherwise.</li>
      </ul>
      <h2>How to give feedback</h2>
      <ul>
        <li>Share the exact URL.</li>
        <li>Quote the formula, definition, or paragraph that seems wrong.</li>
        <li>Include your business model or use case when context matters.</li>
        <li>Include a source if your team uses a different standard definition.</li>
      </ul>
      <p>
        See also: <Link href="/methodology">Methodology</Link>,{" "}
        <Link href="/about">About</Link>, and <Link href="/contact">Contact</Link>.
      </p>
    </div>
  );
}
