import { collectionRoute } from "@/lib/api";
import { getTestimonials, createTestimonial } from "@/lib/content";
import type { Testimonial } from "@/lib/types";

export const { GET, POST } = collectionRoute<Testimonial>({
  list: getTestimonials,
  create: createTestimonial,
});
