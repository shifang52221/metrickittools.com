import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "About MetricKit: calculators, formulas, and assumptions" },
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
      <h2>Who it is for</h2>
      <ul>
        <li>Growth and marketing teams sanity-checking spend efficiency.</li>
        <li>Product and analytics teams aligning on metric definitions.</li>
        <li>Founders and operators reviewing unit economics with clarity.</li>
        <li>Agencies preparing audits or client reviews.</li>
      </ul>
      <h2>What makes the calculators consistent</h2>
      <p>
        We avoid hidden assumptions. Each calculator shows the formula, required
        inputs, and any shortcuts (like constant churn) that may not hold for
        every business. The goal is to make decisions easier, not to replace
        your internal models.
      </p>
      <h2>Methodology</h2>
      <ul>
        <li>Each calculator shows the formula used.</li>
        <li>Inputs are user-provided; we don&apos;t pull live data.</li>
        <li>Results are estimates and can vary by definition and context.</li>
        <li>Outputs are rounded for readability; use exports or notes for precision.</li>
      </ul>
      <h2>How to interpret outputs</h2>
      <ul>
        <li>Keep time units consistent (monthly vs annual).</li>
        <li>Align denominators (users vs accounts, revenue vs gross profit).</li>
        <li>Use sensitivity checks when results drive large decisions.</li>
        <li>Compare like-for-like cohorts when using conversion or churn metrics.</li>
      </ul>
      <h2>Limitations</h2>
      <ul>
        <li>Inputs are only as good as your tracking and definitions.</li>
        <li>Simple models can miss step changes (pricing, product, or market).</li>
        <li>Attribution and incrementality can differ from platform reporting.</li>
      </ul>
      <h2>How to use the calculators</h2>
      <ul>
        <li>Pick the calculator that matches your business model and stage.</li>
        <li>Enter inputs from the same period and the same data source.</li>
        <li>Review the assumptions and adjust if they do not match reality.</li>
        <li>Save or share the link with inputs for team alignment.</li>
      </ul>
      <h2>Versioning and updates</h2>
      <p>
        We update formulas and content as definitions evolve. If a change would
        materially affect a result, we try to clarify the assumption in the
        guide or glossary entry linked to the calculator.
      </p>
      <h2>Data and privacy</h2>
      <ul>
        <li>Calculations run in your browser with the inputs you provide.</li>
        <li>We do not require logins for the calculators.</li>
        <li>See Privacy for details on ads and analytics.</li>
      </ul>
      <h2>How we prioritize new content</h2>
      <ul>
        <li>High-impact metrics tied to retention, payback, or margin.</li>
        <li>Common confusion points that lead to bad decisions.</li>
        <li>Requests with clear inputs, outputs, and definitions.</li>
      </ul>
      <h2>What you can do here</h2>
      <ul>
        <li>Compute metrics fast with transparent assumptions.</li>
        <li>Use guides to avoid denominator and time-window mismatches.</li>
        <li>Use the glossary to align definitions across your team.</li>
        <li>Share calculator links with pre-filled inputs for reviews.</li>
        <li>Cross-check decisions with break-even and sensitivity thinking.</li>
      </ul>
      <h2>Updates and feedback</h2>
      <p>
        We improve calculators and guides based on common questions and audit
        feedback. If you think a definition is off or a workflow is missing,
        send the URL and your context so we can evaluate it.
      </p>
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
