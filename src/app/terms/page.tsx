import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `Terms of service for ${siteConfig.name}.`,
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  const lastUpdated =
    process.env.NEXT_PUBLIC_LEGAL_LAST_UPDATED ?? "2026-01-08";

  return (
    <div className="prose prose-zinc max-w-3xl dark:prose-invert">
      <h1>Terms of Service</h1>
      <p>Last updated: {lastUpdated}</p>
      <h2>Informational use only</h2>
      <p>
        The calculators and content on {siteConfig.name} are provided for
        informational purposes only. They do not constitute financial,
        accounting, tax, or legal advice.
      </p>
      <h2>No warranties</h2>
      <p>
        We provide the site on an &quot;as is&quot; basis without warranties of
        any kind.
        We do not guarantee accuracy, completeness, or suitability for any
        purpose.
      </p>
      <h2>Limitation of liability</h2>
      <p>
        To the maximum extent permitted by law, {siteConfig.name} and its
        operators will not be liable for any damages arising from your use of
        the site.
      </p>
      <h2>Contact</h2>
      <p>
        Questions: <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
      </p>
    </div>
  );
}
