"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Dictionary } from "@/i18n/locales/en";
import type {
  CategoryItem,
  PortfolioProject,
  ServiceItem,
  SiteContent,
  Testimonial,
} from "@/lib/types";
import HeroEditor from "./HeroEditor";
import ContactEditor from "./ContactEditor";
import ServicesEditor from "./ServicesEditor";
import CategoriesEditor from "./CategoriesEditor";
import TestimonialsEditor from "./TestimonialsEditor";
import PortfolioEditor from "./PortfolioEditor";
import SmtpEditor from "./SmtpEditor";

type Tab =
  | "hero"
  | "services"
  | "categories"
  | "portfolio"
  | "testimonials"
  | "contact"
  | "settings";

interface AdminPanelProps {
  dict: Dictionary;
  content: SiteContent;
  services: ServiceItem[];
  categories: CategoryItem[];
  testimonials: Testimonial[];
  projects: PortfolioProject[];
}

export default function AdminPanel({
  dict,
  content,
  services,
  categories,
  testimonials,
  projects,
}: AdminPanelProps) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("hero");

  const tabs: { key: Tab; label: string }[] = [
    { key: "hero", label: dict.admin.tabs.hero },
    { key: "services", label: dict.admin.tabs.services },
    { key: "categories", label: dict.admin.tabs.categories },
    { key: "portfolio", label: dict.admin.tabs.portfolio },
    { key: "testimonials", label: dict.admin.tabs.testimonials },
    { key: "contact", label: dict.admin.tabs.contact },
    { key: "settings", label: dict.admin.tabs.settings },
  ];

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.refresh();
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-stone-900">{dict.admin.title}</h1>
        <button
          type="button"
          onClick={handleLogout}
          className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50"
        >
          {dict.admin.logout}
        </button>
      </div>

      <nav className="mb-8 flex flex-wrap gap-2 border-b border-stone-200 pb-3">
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              tab === t.key
                ? "bg-stone-900 text-white"
                : "text-stone-600 hover:bg-stone-100"
            }`}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {tab === "hero" && <HeroEditor dict={dict} content={content} />}
      {tab === "services" && <ServicesEditor dict={dict} initialItems={services} />}
      {tab === "categories" && <CategoriesEditor dict={dict} initialItems={categories} />}
      {tab === "portfolio" && <PortfolioEditor dict={dict} initialItems={projects} />}
      {tab === "testimonials" && (
        <TestimonialsEditor dict={dict} initialItems={testimonials} />
      )}
      {tab === "contact" && <ContactEditor dict={dict} content={content} />}
      {tab === "settings" && <SmtpEditor dict={dict} />}
    </div>
  );
}
