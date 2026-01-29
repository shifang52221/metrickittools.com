import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `Privacy policy for ${siteConfig.name}, covering ads, cookies, analytics, and your choices.`,
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  const lastUpdated =
    process.env.NEXT_PUBLIC_LEGAL_LAST_UPDATED ?? "2026-01-08";

  return (
    <div className="prose prose-zinc max-w-3xl dark:prose-invert">
      <h1>Privacy Policy</h1>
      <p>Last updated: {lastUpdated}</p>
      <h2>Overview</h2>
      <p>
        {siteConfig.name} provides calculators that run in your browser. By
        default we do not require accounts and we do not ask you to submit
        sensitive personal information.
      </p>
      <h2>Information we may collect</h2>
      <ul>
        <li>Basic usage data (pages visited, time on page).</li>
        <li>Device and browser information (for compatibility and analytics).</li>
        <li>Approximate location derived from IP (country/region level).</li>
      </ul>
      <p>
        We do not intend to collect sensitive personal data through the site.
        If you choose to email us, you control what information you share.
      </p>
      <h2>Advertising</h2>
      <p>
        We may display ads served by Google AdSense. Google and its partners may
        use cookies to serve ads based on your visits to this and other sites.
        You can learn more about how Google uses information from sites at
        Google&apos;s policies.
      </p>
      <p>
        If you prefer non-personalized ads, you can adjust ad settings in your
        Google account or use browser-level controls to limit ad personalization.
      </p>
      <h2>Cookie choices</h2>
      <p>
        If consent is enabled, you can manage your non-essential cookie and
        local storage choices. You can reset or update your choice using the{" "}
        <strong>Privacy choices</strong> (or <strong>Cookie settings</strong>) link
        in the footer.
      </p>
      <h2>Data retention</h2>
      <p>
        We retain data only as long as needed for site operations, analytics,
        and legal compliance. Retention periods may vary by data type.
      </p>
      <h2>Security</h2>
      <p>
        We use reasonable technical and organizational measures to protect data.
        No method of transmission or storage is 100% secure, so we cannot
        guarantee absolute security.
      </p>
      <h2>EEA/UK notice</h2>
      <p>
        If you are in the EEA/UK, cookie requirements may be stricter. You may
        need to use a certified Consent Management Platform (CMP) for Google&apos;s
        requirements and applicable laws.
      </p>
      <h2>Personalized ads</h2>
      <p>
        You may be able to control personalized advertising via Google&apos;s ad
        settings and by using the mechanisms provided by your browser/device.
      </p>
      <h2>Analytics</h2>
      <p>
        We may use privacy-friendly analytics to understand aggregate usage (for
        example: page views). If enabled, we aim to minimize data collection.
      </p>
      <p>
        Analytics data helps us prioritize content improvements, identify broken
        pages, and improve performance. We do not sell personal data.
      </p>
      <h2>Your rights</h2>
      <p>
        Depending on your location, you may have rights to access, correct, or
        delete your personal data, or to opt out of certain processing. Contact
        us if you want to make a request.
      </p>
      <h2>International transfers</h2>
      <p>
        If data is transferred across borders, we take steps to ensure an
        appropriate level of protection consistent with applicable law.
      </p>
      <h2>Changes to this policy</h2>
      <p>
        We may update this policy to reflect product changes or legal
        requirements. The &quot;Last updated&quot; date indicates the latest
        revision.
      </p>
      <h2>Contact</h2>
      <p>
        Questions: <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
      </p>
    </div>
  );
}
