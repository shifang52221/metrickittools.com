import Link from "next/link";
import { siteConfig } from "@/lib/site";
import { LogoMark } from "@/components/site/LogoMark";
import { CookieSettingsButton } from "@/components/consent/CookieSettingsButton";

export function SiteFooter() {
  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto w-full max-w-6xl px-4 py-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-semibold tracking-tight">
              <span className="inline-flex h-7 w-7 items-center justify-center">
                <LogoMark className="h-7 w-7" />
              </span>
              <span>{siteConfig.name}</span>
            </div>
            <div className="max-w-md text-sm text-zinc-600 dark:text-zinc-400">
              {siteConfig.description}
            </div>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <Link href="/saas-metrics" className="hover:underline">
              SaaS Metrics
            </Link>
            <Link href="/paid-ads" className="hover:underline">
              Paid Ads
            </Link>
            <Link href="/finance" className="hover:underline">
              Finance
            </Link>
            <Link href="/guides" className="hover:underline">
              Guides
            </Link>
            <Link href="/glossary" className="hover:underline">
              Glossary
            </Link>
            <Link href="/privacy" className="hover:underline">
              Privacy
            </Link>
            <Link href="/terms" className="hover:underline">
              Terms
            </Link>
            <Link href="/contact" className="hover:underline">
              Contact
            </Link>
            <CookieSettingsButton />
          </div>
        </div>
        <div className="mt-8 text-xs text-zinc-500 dark:text-zinc-500">
          © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
