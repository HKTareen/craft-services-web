import { itemRoute } from "@/lib/api";
import { updateService, deleteService } from "@/lib/content";
import type { ServiceItem } from "@/lib/types";

export const { PUT, DELETE } = itemRoute<ServiceItem>({
  update: updateService,
  remove: deleteService,
});
