import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "Contact MetricKit: support, bug reports, and feedback" },
  description:
    "Contact MetricKit for calculator support, bug reports, or content feedback. Include the URL, inputs, outputs, and time-unit assumptions.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="prose prose-zinc max-w-3xl dark:prose-invert">
      <h1>Contact</h1>
      <p>
        Email: <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
      </p>
      <h2>What we can help with</h2>
      <ul>
        <li>Calculator accuracy and formula questions.</li>
        <li>Content clarity in guides or glossary terms.</li>
        <li>Requests for new calculators or workflow pages.</li>
        <li>Bug reports in layout, inputs, or exports.</li>
      </ul>
      <h2>Bug reports</h2>
      <p>If you found a bug in a calculator, include:</p>
      <ul>
        <li>The calculator URL.</li>
        <li>The input values you entered (screenshots are fine).</li>
        <li>The output you got and what you expected instead.</li>
        <li>Your currency and time unit assumptions (monthly vs annual).</li>
        <li>The browser/device you used.</li>
      </ul>
      <p>
        If the issue is about a formula or definition, include your source or
        how your team defines the metric so we can align the wording.
      </p>
      <h2>Feature requests</h2>
      <p>
        If you want a new calculator, send the metric name, your use case, and
        the inputs you expect to have. We prioritize requests that improve
        decision-making or remove ambiguity.
      </p>
      <h2>Before you send</h2>
      <ul>
        <li>Confirm the calculator version or page URL.</li>
        <li>Check that inputs use the same time window.</li>
        <li>Note whether you want a SaaS or ecommerce interpretation.</li>
      </ul>
      <h2>Content feedback</h2>
      <p>
        If a guide or glossary term is unclear, tell us which part is confusing
        and what decision you were trying to make.
      </p>
      <p>
        If you can, include the metric name, your business model (SaaS or
        ecommerce), and the time window you care about so we can improve the
        explanation.
      </p>
      <h2>Partnerships</h2>
      <p>
        If you want to collaborate on a guide, share your outline, the
        calculator it supports, and any data sources you want referenced.
      </p>
      <h2>Response time</h2>
      <p>
        We aim to respond within a few business days. For urgent issues, include
        &quot;urgent&quot; in the subject line and a short summary of impact.
      </p>
    </div>
  );
}
