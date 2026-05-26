import Link from "next/link";

type TrustPanelProps = {
  methodologyHref: string;
  editorialPolicyHref: string;
  contactHref: string;
};

export function TrustPanel({
  methodologyHref,
  editorialPolicyHref,
  contactHref,
}: TrustPanelProps) {
  return (
    <section className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-500">
        How MetricKit maintains this page
      </div>
      <p className="mt-2 max-w-3xl text-sm text-zinc-700 dark:text-zinc-300">
        Review the methodology behind the formulas, see how content is reviewed,
        and use the contact page for questions, feedback, or corrections.
      </p>
      <div className="mt-4 flex flex-wrap gap-2 text-sm">
        <Link
          href={methodologyHref}
          className="rounded-full border border-zinc-200 bg-white px-3 py-1.5 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-black dark:hover:bg-zinc-900"
        >
          Methodology
        </Link>
        <Link
          href={editorialPolicyHref}
          className="rounded-full border border-zinc-200 bg-white px-3 py-1.5 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-black dark:hover:bg-zinc-900"
        >
          Editorial policy
        </Link>
        <Link
          href={contactHref}
          className="rounded-full border border-zinc-200 bg-white px-3 py-1.5 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-black dark:hover:bg-zinc-900"
        >
          Contact
        </Link>
      </div>
    </section>
  );
}
