import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `How to contact ${siteConfig.name}.`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="prose prose-zinc max-w-3xl dark:prose-invert">
      <h1>Contact</h1>
      <p>
        Email: <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
      </p>
      <h2>Bug reports</h2>
      <p>If you found a bug in a calculator, include:</p>
      <ul>
        <li>The calculator URL.</li>
        <li>The input values you entered (screenshots are fine).</li>
        <li>The output you got and what you expected instead.</li>
        <li>Your currency and time unit assumptions (monthly vs annual).</li>
        <li>The browser/device you used.</li>
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
    </div>
  );
}
