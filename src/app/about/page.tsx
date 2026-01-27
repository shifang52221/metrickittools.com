import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "About MetricKit — calculators, formulas, and assumptions" },
  description:
    "Learn how MetricKit calculators work: definitions, formulas, assumptions, and the methodology we use so you can interpret outputs consistently across your team.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="prose prose-zinc max-w-3xl dark:prose-invert">
      <h1>About {siteConfig.name}</h1>
      <p>
        {siteConfig.name} is a small collection of free calculators for SaaS
        metrics and paid ads. The goal is simple: fast tools with clear formulas
        and assumptions.
      </p>
      <h2>Methodology</h2>
      <ul>
        <li>Each calculator shows the formula used.</li>
        <li>Inputs are user-provided; we don&apos;t pull live data.</li>
        <li>Results are estimates and can vary by definition and context.</li>
      </ul>
      <h2>What you can do here</h2>
      <ul>
        <li>Compute metrics fast with transparent assumptions.</li>
        <li>Use guides to avoid denominator and time-window mismatches.</li>
        <li>Use the glossary to align definitions across your team.</li>
        <li>Share calculator links with pre-filled inputs for reviews.</li>
        <li>Cross-check decisions with break-even and sensitivity thinking.</li>
      </ul>
      <h2>Contact</h2>
      <p>
        Email: <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
      </p>
      <p>
        See also: <Link href="/terms">Terms</Link> and{" "}
        <Link href="/privacy">Privacy</Link>.
      </p>
    </div>
  );
}
