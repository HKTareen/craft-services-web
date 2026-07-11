import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { isValidLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { getProjects } from "@/lib/portfolio";
import PortfolioGrid from "@/components/PortfolioGrid";
import CtaButton, { localizedPath } from "@/components/CtaButton";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return {
    title: dict.portfolio.metaTitle,
    description: dict.portfolio.metaDescription,
  };
}

export default async function PortfolioPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const projects = await getProjects();

  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-stone-900 sm:text-5xl">
            {dict.portfolio.title}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-stone-600">
            {dict.portfolio.subtitle}
          </p>
        </div>

        <div className="mt-12">
          <PortfolioGrid
            locale={locale as Locale}
            dict={dict}
            projects={projects}
          />
        </div>

        <div className="mt-16 text-center">
          <CtaButton href={localizedPath(locale as Locale, "/contact")}>
            {dict.hero.cta}
          </CtaButton>
        </div>
      </div>
    </section>
  );
}
