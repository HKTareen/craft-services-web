import { itemRoute } from "@/lib/api";
import { updateTestimonial, deleteTestimonial } from "@/lib/content";
import type { Testimonial } from "@/lib/types";

export const { PUT, DELETE } = itemRoute<Testimonial>({
  update: updateTestimonial,
  remove: deleteTestimonial,
});
