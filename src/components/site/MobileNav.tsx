"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { categories } from "@/lib/calculators";

const secondaryMobileNavLinks = [
  { href: "/guides", label: "Guides" },
  { href: "/glossary", label: "Glossary" },
  { href: "/search", label: "Search" },
  { href: "/about", label: "About" },
];

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusedElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const triggerElement = triggerRef.current;
    previousFocusedElementRef.current = document.activeElement as HTMLElement;
    closeButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (!dialogRef.current) return;

      if (event.key === "Escape") {
        setIsOpen(false);
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const focusableElements = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
        ),
      );

      if (!focusableElements.length) {
        event.preventDefault();
        return;
      }

      const firstFocusableElement = focusableElements[0];
      const lastFocusableElement = focusableElements[focusableElements.length - 1];
      const activeElement = document.activeElement as HTMLElement | null;

      if (event.shiftKey) {
        if (activeElement === firstFocusableElement) {
          event.preventDefault();
          lastFocusableElement.focus();
        }
        return;
      }

      if (activeElement === lastFocusableElement) {
        event.preventDefault();
        firstFocusableElement.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      const focusTarget = previousFocusedElementRef.current ?? triggerElement;
      focusTarget?.focus();
    };
  }, [isOpen]);

  return (
    <div className="sm:hidden">
      <button
        ref={triggerRef}
        type="button"
        aria-label="Open site navigation menu"
        aria-expanded={isOpen}
        aria-controls="mobile-site-nav"
        onClick={() => setIsOpen(true)}
        className="rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
      >
        Menu
      </button>
      {isOpen ? (
        <div
          className="fixed inset-0 z-50 bg-black/40 p-4"
          onClick={() => setIsOpen(false)}
        >
          <div
            ref={dialogRef}
            id="mobile-site-nav"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
            className="mx-auto mt-16 w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-4 shadow-xl dark:border-zinc-700 dark:bg-zinc-900"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Navigate
              </p>
              <button
                ref={closeButtonRef}
                type="button"
                aria-label="Close site navigation menu"
                onClick={() => setIsOpen(false)}
                className="rounded-full border border-zinc-200 px-3 py-1.5 text-sm text-zinc-700 hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
              >
                Close
              </button>
            </div>
            <nav aria-label="Mobile site sections" className="flex flex-col gap-1">
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  href={`/${category.slug}`}
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg px-3 py-2 text-zinc-700 hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500 dark:text-zinc-200 dark:hover:bg-zinc-800"
                >
                  {category.title}
                </Link>
              ))}
              {secondaryMobileNavLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg px-3 py-2 text-zinc-700 hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500 dark:text-zinc-200 dark:hover:bg-zinc-800"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      ) : null}
    </div>
  );
}
