import { adminDb } from "./firebase/admin";
import { deepMerge } from "./merge";
import {
  DEFAULT_CATEGORIES,
  DEFAULT_SERVICES,
  DEFAULT_SITE_CONTENT,
  DEFAULT_TESTIMONIALS,
} from "./defaults";
import type {
  CategoryItem,
  ServiceItem,
  SiteContent,
  Testimonial,
} from "./types";

/**
 * Content access layer. Reads go through the Admin SDK. Every read is wrapped so
 * that if Firebase is unconfigured/unreachable (e.g. local dev without creds),
 * the site falls back to the built-in defaults instead of erroring.
 */

const CONTENT_DOC = adminDb.collection("content").doc("site");

export async function getSiteContent(): Promise<SiteContent> {
  try {
    const snap = await CONTENT_DOC.get();
    return snap.exists ? (snap.data() as SiteContent) : {};
  } catch (err) {
    console.error("getSiteContent failed, using defaults:", err);
    return {};
  }
}

export async function saveSiteContent(data: SiteContent): Promise<void> {
  await CONTENT_DOC.set(data, { merge: true });
}

/** Stored content overlaid on the built-in defaults, so every field is populated
 *  (used to pre-fill the admin content editor). */
export async function getSiteContentWithDefaults(): Promise<SiteContent> {
  const stored = await getSiteContent();
  return deepMerge(DEFAULT_SITE_CONTENT, stored);
}

/** Read a whole ordered collection, falling back to `fallback` when empty/unavailable. */
async function readCollection<T extends { id: string; order: number }>(
  name: string,
  fallback: T[]
): Promise<T[]> {
  try {
    const snap = await adminDb.collection(name).orderBy("order").get();
    if (snap.empty) return fallback;
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as T);
  } catch (err) {
    console.error(`read ${name} failed, using defaults:`, err);
    return fallback;
  }
}

async function createDoc<T extends object>(
  name: string,
  data: T
): Promise<T & { id: string }> {
  const ref = adminDb.collection(name).doc();
  await ref.set(data);
  return { id: ref.id, ...data };
}

async function updateDoc<T extends object>(
  name: string,
  id: string,
  data: Partial<T>
): Promise<boolean> {
  const ref = adminDb.collection(name).doc(id);
  const snap = await ref.get();
  if (!snap.exists) return false;
  await ref.set(data, { merge: true });
  return true;
}

async function deleteDoc(name: string, id: string): Promise<boolean> {
  const ref = adminDb.collection(name).doc(id);
  const snap = await ref.get();
  if (!snap.exists) return false;
  await ref.delete();
  return true;
}

/**
 * Populate empty collections and a missing content doc with the built-in
 * defaults, so the admin panel has real, editable/deletable/reorderable rows on
 * first run. Idempotent: existing data is left untouched.
 */
export async function seedDefaults(): Promise<void> {
  const seedCollection = async <T extends { id: string }>(
    name: string,
    items: T[]
  ) => {
    const col = adminDb.collection(name);
    const snap = await col.limit(1).get();
    if (!snap.empty) return;
    const batch = adminDb.batch();
    for (const { id, ...rest } of items) {
      batch.set(col.doc(id), rest);
    }
    await batch.commit();
  };

  await seedCollection("services", DEFAULT_SERVICES);
  await seedCollection("categories", DEFAULT_CATEGORIES);
  await seedCollection("testimonials", DEFAULT_TESTIMONIALS);

  const contentSnap = await CONTENT_DOC.get();
  if (!contentSnap.exists) {
    await CONTENT_DOC.set(DEFAULT_SITE_CONTENT);
  }
}

// --- Services ---------------------------------------------------------------
export const getServices = () =>
  readCollection<ServiceItem>("services", DEFAULT_SERVICES);
export const createService = (data: Omit<ServiceItem, "id">) =>
  createDoc("services", data);
export const updateService = (id: string, data: Partial<ServiceItem>) =>
  updateDoc<ServiceItem>("services", id, data);
export const deleteService = (id: string) => deleteDoc("services", id);

// --- Categories -------------------------------------------------------------
export const getCategories = () =>
  readCollection<CategoryItem>("categories", DEFAULT_CATEGORIES);
export const createCategory = (data: Omit<CategoryItem, "id">) =>
  createDoc("categories", data);
export const updateCategory = (id: string, data: Partial<CategoryItem>) =>
  updateDoc<CategoryItem>("categories", id, data);
export const deleteCategory = (id: string) => deleteDoc("categories", id);

// --- Testimonials -----------------------------------------------------------
export const getTestimonials = () =>
  readCollection<Testimonial>("testimonials", DEFAULT_TESTIMONIALS);
export const createTestimonial = (data: Omit<Testimonial, "id">) =>
  createDoc("testimonials", data);
export const updateTestimonial = (id: string, data: Partial<Testimonial>) =>
  updateDoc<Testimonial>("testimonials", id, data);
export const deleteTestimonial = (id: string) => deleteDoc("testimonials", id);
