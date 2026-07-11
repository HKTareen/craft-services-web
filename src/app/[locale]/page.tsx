import { notFound } from "next/navigation";
import { isValidLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { getServices, getCategories, getTestimonials } from "@/lib/content";
import Hero from "@/components/Hero";
import Categories from "@/components/Categories";
import Services from "@/components/Services";
import Reviews from "@/components/Reviews";

// Content is admin-editable, so render on each request rather than at build time.
export const dynamic = "force-dynamic";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const l = locale as Locale;

  const [dict, services, categories, testimonials] = await Promise.all([
    getDictionary(l),
    getServices(),
    getCategories(),
    getTestimonials(),
  ]);

  const serviceCards = services.map((s) => ({
    id: s.id,
    title: s[l].title,
    description: s[l].description,
    spray: s.spray,
    imageUrl: s.imageUrl,
    overlay: s.overlay,
  }));

  const categoryCards = categories.map((c) => ({
    id: c.id,
    title: c[l].title,
    images: c.images,
  }));

  const reviews = testimonials.map((t) => ({
    authorName: t.authorName,
    rating: t.rating,
    text: t[l].text,
    relativeTime: t.relativeTime,
    profilePhotoUrl: t.photoUrl,
  }));

  return (
    <>
      <Hero locale={l} dict={dict} />
      <Categories locale={l} dict={dict} items={categoryCards} />
      <Services dict={dict} items={serviceCards} />
      <Reviews dict={dict} reviews={reviews} />
    </>
  );
}
