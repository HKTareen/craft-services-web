"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Dictionary } from "@/i18n/locales/en";
import type { Locale } from "@/i18n/config";
import { locales } from "@/i18n/config";
import { localizedPath } from "./CtaButton";

interface HeaderProps {
  locale: Locale;
  dict: Dictionary;
}

export default function Header({ locale, dict }: HeaderProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const navLinks = [
    { href: localizedPath(locale, "/"), label: dict.nav.services, hash: "#services" },
    { href: localizedPath(locale, "/portfolio"), label: dict.nav.portfolio, hash: "" },
    { href: localizedPath(locale, "/contact"), label: dict.nav.contact, hash: "" },
  ];

  const switchLocale = (newLocale: Locale) => {
    const segments = pathname.split("/");
    segments[1] = newLocale;
    return segments.join("/") || `/${newLocale}`;
  };

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200 bg-white/95 backdrop-blur-sm leading-none">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-2 sm:px-4 lg:px-6">
        <Link
          href={localizedPath(locale, "/")}
          className="block shrink-0 leading-none transition-opacity hover:opacity-80"
          aria-label={dict.company.name}
        >
          <Image
            src={dict.media.logoUrl}
            alt={dict.company.name}
            width={2252}
            height={667}
            priority
            unoptimized
            className="my-2 block h-16 w-auto bg-transparent sm:h-[4.5rem]"
          />
        </Link>

        <div className="flex items-center gap-6">
          <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={`${link.href}${link.hash}`}
                className="text-sm font-medium text-stone-600 transition-colors hover:text-amber-600"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex rounded-lg border border-stone-200 p-0.5" role="group" aria-label="Language">
            {locales.map((l) => (
              <Link
                key={l}
                href={switchLocale(l)}
                className={`rounded-md px-2.5 py-1 text-xs font-semibold uppercase transition-colors ${
                  l === locale
                    ? "bg-stone-900 text-white"
                    : "text-stone-500 hover:text-stone-900"
                }`}
              >
                {l}
              </Link>
            ))}
          </div>

          <button
            type="button"
            className="rounded-lg p-2 text-stone-600 md:hidden"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-label="Toggle menu"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-stone-200 px-4 py-4 md:hidden" aria-label="Mobile navigation">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={`${link.href}${link.hash}`}
                className="rounded-lg px-3 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
