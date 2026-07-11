import { itemRoute } from "@/lib/api";
import { updateCategory, deleteCategory } from "@/lib/content";
import type { CategoryItem } from "@/lib/types";

export const { PUT, DELETE } = itemRoute<CategoryItem>({
  update: updateCategory,
  remove: deleteCategory,
});
