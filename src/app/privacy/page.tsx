import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `Privacy policy for ${siteConfig.name}.`,
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <div className="prose prose-zinc max-w-3xl dark:prose-invert">
      <h1>Privacy Policy</h1>
      <p>Last updated: {new Date().toISOString().slice(0, 10)}</p>
      <h2>Overview</h2>
      <p>
        {siteConfig.name} provides calculators that run in your browser. By
        default we do not require accounts and we do not ask you to submit
        sensitive personal information.
      </p>
      <h2>Advertising</h2>
      <p>
        We may display ads served by Google AdSense. Google and its partners may
        use cookies to serve ads based on your visits to this and other sites.
        You can learn more about how Google uses information from sites at
        Google’s policies.
      </p>
      <h2>Cookie choices</h2>
      <p>
        If cookie consent is enabled, you can accept or decline non-essential
        cookies using the banner. You can also reset your choice using the{" "}
        <strong>Cookie settings</strong> link in the footer.
      </p>
      <h2>EEA/UK notice</h2>
      <p>
        If you are in the EEA/UK, cookie requirements may be stricter. You may
        need to use a certified Consent Management Platform (CMP) for Google’s
        requirements and applicable laws.
      </p>
      <h2>Personalized ads</h2>
      <p>
        You may be able to control personalized advertising via Google’s ad
        settings and by using the mechanisms provided by your browser/device.
      </p>
      <h2>Analytics</h2>
      <p>
        We may use privacy-friendly analytics to understand aggregate usage (for
        example: page views). If enabled, we aim to minimize data collection.
      </p>
      <h2>Contact</h2>
      <p>
        Questions: <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
      </p>
    </div>
  );
}
