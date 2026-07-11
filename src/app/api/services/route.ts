import { collectionRoute } from "@/lib/api";
import { getServices, createService } from "@/lib/content";
import type { ServiceItem } from "@/lib/types";

export const { GET, POST } = collectionRoute<ServiceItem>({
  list: getServices,
  create: createService,
});
