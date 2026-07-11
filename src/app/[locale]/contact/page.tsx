import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { isValidLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import ContactForm from "@/components/ContactForm";

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
    title: dict.contact.metaTitle,
    description: dict.contact.metaDescription,
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const { phoneValue, emailValue } = dict.contact.details;
  const telHref = `tel:${phoneValue.replace(/[^0-9+]/g, "")}`;

  return (
    <>
      <section className="relative flex min-h-[40vh] items-center justify-center overflow-hidden bg-stone-900 text-white">
        <Image
          src="/images/contact-hero.webp"
          alt=""
          fill
          priority
          className="object-cover opacity-30"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-stone-950/80 to-stone-900/60" />
        <div className="relative px-4 py-20 text-center sm:px-6">
          <h1 className="mx-auto max-w-3xl text-4xl font-bold sm:text-5xl">
            {dict.contact.hookSubtitle}
          </h1>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
          <aside className="rounded-2xl bg-stone-50 p-8 lg:col-span-1">
            <h2 className="text-xl font-semibold text-stone-900">
              {dict.contact.details.title}
            </h2>
            <dl className="mt-6 space-y-4 text-sm">
              <div>
                <dt className="font-medium text-stone-500">{dict.contact.details.phone}</dt>
                <dd className="mt-1 text-stone-900">
                  <a href={telHref} className="hover:text-amber-600">
                    {phoneValue}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="font-medium text-stone-500">{dict.contact.details.email}</dt>
                <dd className="mt-1 text-stone-900">
                  <a href={`mailto:${emailValue}`} className="hover:text-amber-600">
                    {emailValue}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="font-medium text-stone-500">{dict.contact.details.hours}</dt>
                <dd className="mt-1 text-stone-900">{dict.contact.details.hoursValue}</dd>
              </div>
            </dl>
          </aside>

          <div className="lg:col-span-2">
            <ContactForm dict={dict} />
          </div>
        </div>
      </section>
    </>
  );
}
