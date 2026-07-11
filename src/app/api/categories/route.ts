import { collectionRoute } from "@/lib/api";
import { getCategories, createCategory } from "@/lib/content";
import type { CategoryItem } from "@/lib/types";

export const { GET, POST } = collectionRoute<CategoryItem>({
  list: getCategories,
  create: createCategory,
});
