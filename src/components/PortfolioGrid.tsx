import Image from "next/image";
import type { Dictionary } from "@/i18n/locales/en";
import type { Locale } from "@/i18n/config";
import type { PortfolioProject } from "@/lib/types";
import { getProjectTitle, getProjectDescription } from "./CtaButton";

interface PortfolioGridProps {
  locale: Locale;
  dict: Dictionary;
  projects: PortfolioProject[];
}

export default function PortfolioGrid({ locale, dict, projects }: PortfolioGridProps) {
  if (projects.length === 0) {
    return (
      <p className="py-16 text-center text-lg text-stone-500">{dict.portfolio.empty}</p>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <article
          key={project.id}
          className="group overflow-hidden rounded-2xl bg-white shadow-md transition-shadow hover:shadow-xl"
        >
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src={project.imageUrl}
              alt={getProjectTitle(project, locale)}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
            <span className="absolute left-3 top-3 rounded-full bg-stone-900/80 px-3 py-1 text-xs font-medium capitalize text-white backdrop-blur-sm">
              {dict.admin.categories[project.category]}
            </span>
          </div>
          <div className="p-5">
            <h3 className="text-lg font-semibold text-stone-900">
              {getProjectTitle(project, locale)}
            </h3>
            <p className="mt-2 line-clamp-2 text-sm text-stone-600">
              {getProjectDescription(project, locale)}
            </p>
          </div>
        </article>
      ))}
    </div>
  );
}
