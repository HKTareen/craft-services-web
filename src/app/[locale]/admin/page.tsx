import { notFound } from "next/navigation";
import { isValidLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { isAdminAuthenticated } from "@/lib/auth";
import {
  getSiteContentWithDefaults,
  getServices,
  getCategories,
  getTestimonials,
  seedDefaults,
} from "@/lib/content";
import { getProjects } from "@/lib/portfolio";
import LoginForm from "@/components/admin/LoginForm";
import AdminPanel from "@/components/admin/AdminPanel";

export const dynamic = "force-dynamic";

export const metadata = {
  robots: { index: false, follow: false },
};

export default async function AdminPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const l = locale as Locale;
  const dict = await getDictionary(l);

  const authed = await isAdminAuthenticated();

  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {authed ? await renderPanel(dict) : <LoginForm dict={dict} />}
      </div>
    </section>
  );
}

async function renderPanel(dict: Awaited<ReturnType<typeof getDictionary>>) {
  // Ensure collections hold real, editable docs (idempotent — only seeds when empty).
  try {
    await seedDefaults();
  } catch (err) {
    console.error("Auto-seed skipped:", err);
  }

  const [content, services, categories, testimonials, projects] = await Promise.all([
    getSiteContentWithDefaults(),
    getServices(),
    getCategories(),
    getTestimonials(),
    getProjects(),
  ]);

  return (
    <AdminPanel
      dict={dict}
      content={content}
      services={services}
      categories={categories}
      testimonials={testimonials}
      projects={projects}
    />
  );
}
