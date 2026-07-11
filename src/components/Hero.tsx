import Image from "next/image";
import type { Dictionary } from "@/i18n/locales/en";
import type { Locale } from "@/i18n/config";
import CtaButton, { localizedPath } from "./CtaButton";

interface HeroProps {
  locale: Locale;
  dict: Dictionary;
}

export default function Hero({ locale, dict }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-white text-stone-900">
      <div className="absolute inset-0">
        <Image
          src={dict.media.heroImageUrl}
          alt=""
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/75 to-white/55" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
        <div className="max-w-3xl">
          <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            {dict.hero.title}
          </h1>
          <div className="mt-10">
            <CtaButton href={localizedPath(locale, "/contact")}>
              {dict.hero.cta}
            </CtaButton>
          </div>
        </div>
      </div>
    </section>
  );
}
