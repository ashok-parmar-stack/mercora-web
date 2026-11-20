import { Business } from "../businesses/types/business.types";

export interface SavedBusinessItem {
  id: string;
  business: Business;
  savedAt: string;
}
