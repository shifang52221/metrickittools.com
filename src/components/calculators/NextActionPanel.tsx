import Link from "next/link";

type NextActionPanelProps = {
  title: string;
  body: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel?: string;
  secondaryHref?: string;
};

export function NextActionPanel({
  title,
  body,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
}: NextActionPanelProps) {
  return (
    <section className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-500">
        Next action
      </div>
      <h2 className="mt-2 text-lg font-semibold tracking-tight">{title}</h2>
      <p className="mt-2 max-w-3xl text-sm text-zinc-700 dark:text-zinc-300">
        {body}
      </p>
      <div className="mt-4 flex flex-wrap gap-2 text-sm">
        <Link
          href={primaryHref}
          className="rounded-full bg-black px-4 py-2 font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
        >
          {primaryLabel}
        </Link>
        {secondaryLabel && secondaryHref ? (
          <Link
            href={secondaryHref}
            className="rounded-full border border-zinc-200 bg-white px-4 py-2 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-black dark:hover:bg-zinc-900"
          >
            {secondaryLabel}
          </Link>
        ) : null}
      </div>
    </section>
  );
}
