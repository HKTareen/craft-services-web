"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import type { Dictionary } from "@/i18n/locales/en";
import type { Locale } from "@/i18n/config";
import CtaButton, { localizedPath } from "./CtaButton";

export interface CategoryCard {
  id: string;
  title: string;
  images: string[];
}

interface CategoriesProps {
  locale: Locale;
  dict: Dictionary;
  items: CategoryCard[];
}

function CategoryBlock({ id, title, images }: CategoryCard) {
  const [index, setIndex] = useState(0);
  const safeImages = images.length ? images : [""];

  const nextImage = useCallback(() => {
    setIndex((current) => (current + 1) % safeImages.length);
  }, [safeImages.length]);

  useEffect(() => {
    if (safeImages.length < 2) return;
    const timer = setInterval(nextImage, 2000);
    return () => clearInterval(timer);
  }, [nextImage, safeImages.length]);

  return (
    <article
      className="group relative overflow-hidden rounded-2xl bg-stone-900 shadow-md transition-shadow hover:shadow-xl"
      onClick={nextImage}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          nextImage();
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`${title} — tap to change image`}
    >
      <div className="relative aspect-[4/3] cursor-pointer overflow-hidden sm:aspect-[3/4] lg:aspect-[4/5]">
        {safeImages.map((src, i) =>
          src ? (
            <Image
              key={`${id}-${src}`}
              src={src}
              alt={i === index ? title : ""}
              fill
              className={`object-cover transition-opacity duration-700 ease-in-out ${
                i === index ? "opacity-100 scale-100" : "opacity-0 scale-105"
              }`}
              sizes="(max-width: 768px) 100vw, 50vw"
              priority={i === 0}
              aria-hidden={i !== index}
            />
          ) : null
        )}

        <div className="pointer-events-none absolute inset-0 bg-black/40" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        <div className="pointer-events-none absolute bottom-4 left-4 right-4 flex items-end justify-between">
          <h3 className="text-2xl font-bold text-white drop-shadow-md sm:text-3xl">
            {title}
          </h3>
          {safeImages.length > 1 && (
            <div className="flex gap-1.5" aria-hidden>
              {safeImages.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === index ? "w-5 bg-amber-400" : "w-1.5 bg-white/50"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

export default function Categories({ locale, dict, items }: CategoriesProps) {
  return (
    <section className="bg-stone-50 py-16 sm:py-24" aria-label={dict.nav.services}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2">
          {items.map((item) => (
            <CategoryBlock
              key={item.id}
              id={item.id}
              title={item.title}
              images={item.images}
            />
          ))}
        </div>

        <div className="mt-12 text-center">
          <CtaButton href={localizedPath(locale, "/contact")}>
            {dict.categories.cta}
          </CtaButton>
        </div>
      </div>
    </section>
  );
}
