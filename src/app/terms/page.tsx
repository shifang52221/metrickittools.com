import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `Terms of service for ${siteConfig.name}, including use, limitations, and disclaimers.`,
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
      <ul>
        <li>Always validate assumptions (time windows, margins, and definitions).</li>
        <li>Use results as directional guidance, not as guarantees.</li>
        <li>Consider your specific context (industry, pricing model, and risk).</li>
        <li>When in doubt, consult a qualified professional.</li>
      </ul>
      <h2>No warranties</h2>
      <p>
        We provide the site on an &quot;as is&quot; basis without warranties of
        any kind.
        We do not guarantee accuracy, completeness, or suitability for any
        purpose.
      </p>
      <h2>Accuracy and verification</h2>
      <p>
        You are responsible for validating inputs and outputs before using them
        in financial, legal, or operational decisions. Calculators are designed
        for planning and education, not certification.
      </p>
      <h2>Acceptable use</h2>
      <ul>
        <li>Do not use the site for unlawful activities.</li>
        <li>Do not attempt to disrupt, overload, or scrape the site.</li>
        <li>Do not misrepresent results as certified or guaranteed.</li>
      </ul>
      <h2>User responsibilities</h2>
      <ul>
        <li>Use accurate, consistent inputs and verify results independently.</li>
        <li>Ensure any decisions comply with your legal and regulatory context.</li>
        <li>Maintain your own records; calculators do not store your data.</li>
      </ul>
      <h2>Intellectual property</h2>
      <p>
        All content, calculators, and branding are owned by {siteConfig.name}
        or its licensors. You may link to or reference public pages, but you
        may not copy or redistribute content at scale without permission.
      </p>
      <h2>Third-party services</h2>
      <p>
        We may link to or embed third-party services. Their terms and privacy
        policies apply to your use of those services.
      </p>
      <h2>Availability</h2>
      <p>
        We may change or discontinue features at any time without notice. We do
        not guarantee uptime, data retention, or continued access to any
        specific calculator.
      </p>
      <h2>Feedback license</h2>
      <p>
        If you provide feedback or suggestions, you grant us a non-exclusive
        right to use it to improve the site without obligation or compensation.
      </p>
      <h2>Limitation of liability</h2>
      <p>
        To the maximum extent permitted by law, {siteConfig.name} and its
        operators will not be liable for any damages arising from your use of
        the site.
      </p>
      <h2>Changes to these terms</h2>
      <p>
        We may update these terms from time to time. The &quot;Last updated&quot;
        date reflects the latest revision. Continued use of the site means you
        accept the updated terms.
      </p>
      <h2>Governing law</h2>
      <p>
        These terms are governed by the laws applicable to the site operator.
        If a dispute arises, it should be resolved in the relevant courts for
        that jurisdiction unless local law requires otherwise.
      </p>
      <h2>Contact</h2>
      <p>
        Questions: <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
      </p>
    </div>
  );
}
