import en from "@/i18n/locales/en";
import fr from "@/i18n/locales/fr";
import type {
  CategoryItem,
  ServiceItem,
  SiteContent,
  Testimonial,
} from "./types";

/**
 * Built-in content derived from the static dictionaries and the original
 * hardcoded image maps. Used as the fallback when a Firestore collection is
 * empty, and as the payload for the one-time seed script — so a fresh install
 * looks identical to the pre-CMS site.
 */

type ServiceKey = keyof typeof en.services.items;

const SERVICE_ORDER: ServiceKey[] = [
  "coating",
  "iron",
  "kitchen",
  "agricultural",
  "windows",
  "pressure",
];

const serviceImages: Record<ServiceKey, string> = {
  kitchen: "/images/services/cuisine.jpeg",
  iron: "/images/services/forge.jpeg",
  agricultural: "/images/services/agri.jpeg",
  pressure: "/images/services/lavaga.webp",
  coating: "/images/services/coating.webp",
  windows: "/images/services/windows-doors.webp",
};

const serviceOverlays: Record<ServiceKey, string> = {
  kitchen: "from-amber-500/60 to-orange-600/50",
  iron: "from-stone-700/60 to-stone-900/55",
  agricultural: "from-emerald-500/60 to-green-700/50",
  pressure: "from-sky-500/60 to-blue-600/50",
  coating: "from-violet-500/60 to-purple-700/50",
  windows: "from-rose-500/60 to-red-600/50",
};

const serviceSpray: Record<ServiceKey, boolean> = {
  coating: true,
  iron: false,
  kitchen: true,
  agricultural: true,
  windows: true,
  pressure: false,
};

export const DEFAULT_SERVICES: ServiceItem[] = SERVICE_ORDER.map((key, i) => ({
  id: key,
  order: i,
  spray: serviceSpray[key],
  imageUrl: serviceImages[key],
  overlay: serviceOverlays[key],
  en: en.services.items[key],
  fr: fr.services.items[key],
}));

export const DEFAULT_CATEGORIES: CategoryItem[] = [
  {
    id: "interior",
    order: 0,
    images: ["/images/categories/interior.webp", "/images/services/kitchen.webp"],
    en: en.categories.interior,
    fr: fr.categories.interior,
  },
  {
    id: "exterior",
    order: 1,
    images: ["/images/portfolio/ext1.jpeg", "/images/portfolio/ext2.jpeg"],
    en: en.categories.exterior,
    fr: fr.categories.exterior,
  },
];

export const DEFAULT_HERO_IMAGE = "/images/hero.webp";
export const DEFAULT_LOGO_IMAGE = "/images/logo-current.png";

/** Contact phone/email are the values previously hardcoded in the contact page. */
const DEFAULT_PHONE = "(418) 454-8959";
const DEFAULT_EMAIL = "Info@finitionpeinture.com";

/** Editable singleton copy seeded into `content/site`, derived from the dictionaries. */
export const DEFAULT_SITE_CONTENT: SiteContent = {
  media: {
    heroImageUrl: DEFAULT_HERO_IMAGE,
    logoUrl: DEFAULT_LOGO_IMAGE,
  },
  en: {
    company: { name: en.company.name },
    hero: { title: en.hero.title, cta: en.hero.cta },
    contact: {
      hook: en.contact.hook,
      hookSubtitle: en.contact.hookSubtitle,
      details: {
        phone: en.contact.details.phone,
        phoneValue: DEFAULT_PHONE,
        email: en.contact.details.email,
        emailValue: DEFAULT_EMAIL,
        hours: en.contact.details.hours,
        hoursValue: en.contact.details.hoursValue,
      },
    },
    reviews: { title: en.reviews.title, subtitle: en.reviews.subtitle },
    footer: {
      tagline: en.footer.tagline,
      copyrightName: en.footer.copyrightName,
      rights: en.footer.rights,
    },
  },
  fr: {
    company: { name: fr.company.name },
    hero: { title: fr.hero.title, cta: fr.hero.cta },
    contact: {
      hook: fr.contact.hook,
      hookSubtitle: fr.contact.hookSubtitle,
      details: {
        phone: fr.contact.details.phone,
        phoneValue: DEFAULT_PHONE,
        email: fr.contact.details.email,
        emailValue: DEFAULT_EMAIL,
        hours: fr.contact.details.hours,
        hoursValue: fr.contact.details.hoursValue,
      },
    },
    reviews: { title: fr.reviews.title, subtitle: fr.reviews.subtitle },
    footer: {
      tagline: fr.footer.tagline,
      copyrightName: fr.footer.copyrightName,
      rights: fr.footer.rights,
    },
  },
};

export const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    id: "seed-1",
    order: 0,
    authorName: "Marie Tremblay",
    rating: 5,
    relativeTime: "2 months ago",
    en: {
      text: "Outstanding kitchen renovation. The cabinets are flawless and the team was professional from start to finish.",
    },
    fr: {
      text: "Rénovation de cuisine exceptionnelle. Les armoires sont impeccables et l'équipe a été professionnelle du début à la fin.",
    },
  },
  {
    id: "seed-2",
    order: 1,
    authorName: "Jean Dupont",
    rating: 5,
    relativeTime: "4 months ago",
    en: {
      text: "They restored our heritage iron gate beautifully. It looks brand new but keeps its original character.",
    },
    fr: {
      text: "Ils ont magnifiquement restauré notre portail en fer patrimonial. Il a l'air neuf tout en gardant son caractère d'origine.",
    },
  },
  {
    id: "seed-3",
    order: 2,
    authorName: "Sarah Mitchell",
    rating: 5,
    relativeTime: "6 months ago",
    en: {
      text: "Fast, reliable commercial build-out. Our storefront was ready ahead of schedule. Highly recommend.",
    },
    fr: {
      text: "Aménagement commercial rapide et fiable. Notre devanture était prête avant l'échéance. Je recommande vivement.",
    },
  },
];
