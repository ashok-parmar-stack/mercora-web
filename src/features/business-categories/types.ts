export interface BusinessCategoryItem {
  id: string;
  name: string;
  code: string;
  slug: string;
  type?: string;
  description?: string;
  icon?: string;
  parentId?: string | null;
  displayOrder: number;
  status?: string;
  isActive?: boolean;
  businessCount: number;
  subcategories?: BusinessCategoryItem[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateBusinessCategoryPayload {
  name: string;
  code?: string;
  slug?: string;
  parentId?: string | null;
  type?: string;
  description?: string;
  icon?: string;
  displayOrder?: number;
  status?: string;
  isActive?: boolean;
}

export interface UpdateBusinessCategoryPayload {
  name?: string;
  code?: string;
  slug?: string;
  parentId?: string | null;
  type?: string;
  description?: string;
  icon?: string;
  displayOrder?: number;
  status?: string;
  isActive?: boolean;
}
