import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "About MetricKit: calculators, formulas, and assumptions" },
  description:
    "Learn what MetricKit publishes, who it serves, how calculators and content are reviewed, and where to find our methodology and editorial policy.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="prose prose-zinc max-w-3xl dark:prose-invert">
      <h1>About {siteConfig.name}</h1>
      <p>
        {siteConfig.name} publishes free calculators, guides, and glossary pages
        for SaaS metrics, paid ads, and finance workflows. The goal is simple:
        make formulas, assumptions, and decision tradeoffs easier to inspect
        before someone copies a number into a model or meeting deck.
      </p>
      <h2>Who we publish for</h2>
      <ul>
        <li>Growth and marketing teams sanity-checking spend efficiency.</li>
        <li>Product and analytics teams aligning on metric definitions.</li>
        <li>Founders and operators reviewing unit economics with clarity.</li>
        <li>Agencies preparing audits or client reviews.</li>
      </ul>
      <h2>What {siteConfig.name} is</h2>
      <p>
        We operate with a brand-editorial model. Pages are written by{" "}
        <strong>{siteConfig.editorialTeamName}</strong> and reviewed under the{" "}
        <strong>{siteConfig.reviewTeamName}</strong> workflow before updates are
        published to the live site.
      </p>
      <h2>What makes the site useful</h2>
      <p>
        We avoid hidden assumptions. Each calculator shows the formula, required
        inputs, and any shortcuts (like constant churn) that may not hold for
        every business. The goal is to make decisions easier, not to replace
        your internal models.
      </p>
      <h2>How we publish</h2>
      <ul>
        <li>Each calculator and content page states its working formula or decision logic.</li>
        <li>Inputs are user-provided; we don&apos;t pull live operational or market data.</li>
        <li>Results are estimates and can vary by definition, segmentation, and context.</li>
        <li>Linked guides and glossary pages explain common denominator, time-window, and interpretation mistakes.</li>
      </ul>
      <p>
        For the full publishing framework, see{" "}
        <Link href="/methodology">Methodology</Link> and{" "}
        <Link href="/editorial-policy">Editorial Policy</Link>.
      </p>
      <h2>How to interpret outputs</h2>
      <ul>
        <li>Keep time units consistent (monthly vs annual).</li>
        <li>Align denominators (users vs accounts, revenue vs gross profit).</li>
        <li>Use sensitivity checks when results drive large decisions.</li>
        <li>Compare like-for-like cohorts when using conversion or churn metrics.</li>
      </ul>
      <h2>Editorial review stance</h2>
      <ul>
        <li>We prefer clear formulas over black-box outputs.</li>
        <li>We revise wording when a definition is ambiguous or commonly misused.</li>
        <li>We treat calculators as decision aids, not as substitutes for professional advice.</li>
      </ul>
      <h2>Limitations and boundaries</h2>
      <ul>
        <li>Inputs are only as good as your tracking and definitions.</li>
        <li>Simple models can miss step changes (pricing, product, or market).</li>
        <li>Attribution and incrementality can differ from platform reporting.</li>
        <li>Some pages summarize a concept rather than replace a full internal model.</li>
      </ul>
      <h2>How to use the site well</h2>
      <ul>
        <li>Pick the calculator that matches your business model and stage.</li>
        <li>Enter inputs from the same period and the same data source.</li>
        <li>Review the assumptions and adjust if they do not match reality.</li>
        <li>Save or share the link with inputs for team alignment.</li>
      </ul>
      <h2>Updates and corrections</h2>
      <p>
        We update formulas, explanations, and examples as definitions evolve or
        when we find a clearer way to explain a concept. If a change materially
        affects interpretation, we try to make that clearer in the linked guide,
        glossary page, or calculator notes.
      </p>
      <h2>Transparency and trust pages</h2>
      <ul>
        <li><Link href="/about">About</Link>: what the site publishes and who it serves.</li>
        <li><Link href="/methodology">Methodology</Link>: formulas, assumptions, and update logic.</li>
        <li><Link href="/editorial-policy">Editorial Policy</Link>: drafting, review, corrections, and conflicts.</li>
        <li><Link href="/privacy">Privacy</Link> and <Link href="/terms">Terms</Link>: legal and data handling details.</li>
      </ul>
      <h2>How we prioritize new content</h2>
      <ul>
        <li>High-impact metrics tied to retention, payback, or margin.</li>
        <li>Common confusion points that lead to bad decisions.</li>
        <li>Requests with clear inputs, outputs, and definitions.</li>
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
        See also: <Link href="/methodology">Methodology</Link>,{" "}
        <Link href="/editorial-policy">Editorial Policy</Link>,{" "}
        <Link href="/terms">Terms</Link>, and <Link href="/privacy">Privacy</Link>.
      </p>
    </div>
  );
}
