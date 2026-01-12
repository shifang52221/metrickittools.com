import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: `About ${siteConfig.name} and how the calculators work.`,
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
