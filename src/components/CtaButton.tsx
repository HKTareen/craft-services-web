import Link from "next/link";
import type { Dictionary } from "@/i18n/locales/en";
import type { Locale } from "@/i18n/config";

interface CtaButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
}

export default function CtaButton({
  href,
  children,
  variant = "primary",
  className = "",
}: CtaButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-lg px-6 py-3 text-base font-semibold transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";
  const variants = {
    primary:
      "bg-stone-950 text-white hover:bg-white hover:text-stone-950 border-2 border-stone-950 focus-visible:outline-stone-950 shadow-lg shadow-stone-900/20",
    secondary:
      "border-2 border-stone-800 text-stone-800 hover:bg-stone-800 hover:text-white focus-visible:outline-stone-800",
  };

  return (
    <Link href={href} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </Link>
  );
}

export function localizedPath(locale: Locale, path: string): string {
  return `/${locale}${path}`;
}

export function getProjectTitle(
  project: { title: string; titleFr?: string },
  locale: Locale
): string {
  return locale === "fr" && project.titleFr ? project.titleFr : project.title;
}

export function getProjectDescription(
  project: { description: string; descriptionFr?: string },
  locale: Locale
): string {
  return locale === "fr" && project.descriptionFr
    ? project.descriptionFr
    : project.description;
}

export type { Dictionary };
