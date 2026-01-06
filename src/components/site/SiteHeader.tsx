import Link from "next/link";
import { categories } from "@/lib/calculators";
import { siteConfig } from "@/lib/site";
import { LogoMark } from "@/components/site/LogoMark";
import { HeaderSearch } from "@/components/search/HeaderSearch";

export function SiteHeader() {
  return (
    <header className="border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-black/60">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold tracking-tight"
        >
          <span className="inline-flex h-8 w-8 items-center justify-center">
            <LogoMark className="h-8 w-8" />
          </span>
          <span>{siteConfig.name}</span>
        </Link>
        <nav className="hidden items-center gap-4 text-sm sm:flex">
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/${c.slug}`}
              className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              {c.title}
            </Link>
          ))}
          <Link
            href="/guides"
            className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            Guides
          </Link>
          <Link
            href="/search"
            className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            Search
          </Link>
          <Link
            href="/about"
            className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            About
          </Link>
        </nav>
        <HeaderSearch />
        <Link
          href="/saas-metrics"
          className="rounded-full bg-black px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
        >
          Browse calculators
        </Link>
      </div>
    </header>
  );
}
