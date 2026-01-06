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
      <p>
        If you found a bug in a calculator, include the input values and the
        expected result.
      </p>
    </div>
  );
}

