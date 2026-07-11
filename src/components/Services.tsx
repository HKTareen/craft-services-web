"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { Dictionary } from "@/i18n/locales/en";
import { SprayIcon } from "@/components/icons/SprayIcon";

export interface ServiceCard {
  id: string;
  title: string;
  description: string;
  spray: boolean;
  imageUrl: string;
  /** Tailwind gradient classes for the overlay. */
  overlay: string;
}

interface ServicesProps {
  dict: Dictionary;
  items: ServiceCard[];
}

function SprayBadge({ label }: { label: string }) {
  return (
    <div className="pointer-events-none absolute left-4 top-4 z-10 flex items-center gap-2 rounded-xl bg-white/95 px-3 py-1.5 shadow-md sm:px-4">
      <SprayIcon className="h-6 w-6 shrink-0 text-stone-900 sm:h-7 sm:w-7" />
      <span className="text-sm font-semibold text-stone-900 sm:text-base">{label}</span>
    </div>
  );
}

function ServiceDescription({
  text,
  seeMore,
  seeLess,
}: {
  text: string;
  seeMore: string;
  seeLess: string;
}) {
  const pRef = useRef<HTMLParagraphElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [clamped, setClamped] = useState(false);

  useEffect(() => {
    const el = pRef.current;
    if (!el) return;

    const check = () => {
      // When clamped, an overflowing element's scrollHeight exceeds its clientHeight.
      if (!expanded) setClamped(el.scrollHeight > el.clientHeight + 1);
    };

    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [text, expanded]);

  return (
    <>
      <p
        ref={pRef}
        className={`mt-2 text-sm leading-relaxed text-stone-600 ${
          expanded ? "" : "line-clamp-4"
        }`}
      >
        {text}
      </p>
      {(clamped || expanded) && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-2 self-start text-sm font-semibold text-amber-600 hover:text-amber-700"
        >
          {expanded ? seeLess : seeMore}
        </button>
      )}
    </>
  );
}

export default function Services({ dict, items }: ServicesProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="services"
      className="bg-stone-50 py-20 sm:py-28"
      aria-label={dict.services.title}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => (
            <article
              key={item.id}
              style={{ transitionDelay: `${index * 100}ms` }}
              className={`group relative overflow-hidden rounded-2xl shadow-md ring-1 ring-stone-200 transition-all duration-500 ease-out hover:shadow-xl ${
                visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div
                  className={`absolute inset-0 bg-gradient-to-br transition-opacity duration-500 group-hover:opacity-80 ${item.overlay}`}
                />
                {item.spray && <SprayBadge label={dict.services.sprayLabel} />}
              </div>

              <div className="flex flex-col p-6">
                <h3 className="text-xl font-bold text-stone-900">{item.title}</h3>
                <ServiceDescription
                  text={item.description}
                  seeMore={dict.services.seeMore}
                  seeLess={dict.services.seeLess}
                />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
