import type { Locale } from "./config";
import type { Dictionary } from "./locales/en";
import { getSiteContent } from "@/lib/content";
import { deepMerge } from "@/lib/merge";

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  en: () => import("./locales/en").then((m) => m.default),
  fr: () => import("./locales/fr").then((m) => m.default),
};

/**
 * Returns the localized dictionary with any admin-managed overrides from the
 * `content/site` Firestore doc merged on top of the built-in defaults. deepMerge
 * clones the base first, so the shared dictionary singleton is never mutated.
 */
export async function getDictionary(locale: Locale): Promise<Dictionary> {
  const base = await dictionaries[locale]();
  const content = await getSiteContent();

  const withOverride = deepMerge(base, content[locale] ?? {});
  return deepMerge(withOverride, { media: content.media ?? {} });
}
