import type { Locale } from "@/i18n/config";

export type ProjectCategory = "interior" | "exterior" | "commercial";

export interface PortfolioProject {
  id: string;
  title: string;
  titleFr?: string;
  description: string;
  descriptionFr?: string;
  category: ProjectCategory;
  imageUrl: string;
  createdAt: string;
}

export interface GoogleReview {
  authorName: string;
  rating: number;
  text: string;
  relativeTime: string;
  profilePhotoUrl?: string;
}

/** A field that carries both language variants, edited side-by-side in admin. */
export type Localized<T> = Record<Locale, T>;

export interface ServiceItem {
  id: string;
  order: number;
  spray: boolean;
  imageUrl: string;
  /** Tailwind gradient classes for the image overlay, e.g. "from-amber-500/60 to-orange-600/50". */
  overlay: string;
  en: { title: string; description: string };
  fr: { title: string; description: string };
}

export interface CategoryItem {
  id: string;
  order: number;
  images: string[];
  en: { title: string; description: string };
  fr: { title: string; description: string };
}

export interface Testimonial {
  id: string;
  order: number;
  authorName: string;
  rating: number;
  relativeTime: string;
  photoUrl?: string;
  en: { text: string };
  fr: { text: string };
}

/**
 * Editable singleton copy + media, stored in the `content/site` Firestore doc.
 * Every field is optional: whatever is present overrides the built-in dictionary
 * defaults (see src/lib/content.ts), so the site always renders.
 */
export interface SiteContent {
  media?: {
    heroImageUrl?: string;
    logoUrl?: string;
  };
  en?: SiteContentOverride;
  fr?: SiteContentOverride;
}

export interface SiteContentOverride {
  hero?: { title?: string; cta?: string };
  contact?: {
    hook?: string;
    hookSubtitle?: string;
    details?: {
      phone?: string;
      phoneValue?: string;
      email?: string;
      emailValue?: string;
      hours?: string;
      hoursValue?: string;
    };
  };
  reviews?: { title?: string; subtitle?: string };
  footer?: { tagline?: string; copyrightName?: string; rights?: string };
  company?: { name?: string };
}

export interface SmtpSettings {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  fromEmail: string;
  toEmail: string;
}
