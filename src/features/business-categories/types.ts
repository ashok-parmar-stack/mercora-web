export interface BusinessCategoryItem {
  id: string;
  name: string;
  code: string;
  slug: string;
  type: string;
  description?: string;
  icon?: string;
  displayOrder: number;
  businessCount: number;
}
