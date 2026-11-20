export type HsnLevel = 'CHAPTER_2' | 'HEADING_4' | 'SUBHEADING_6' | 'TARIFF_8';

export interface HsnStatus {
  id: string;
  type: string;
  code: string;
  name: string;
  description?: string;
  isActive: boolean;
}

export interface HsnCode {
  id: string;
  code: string;
  name: string;
  description?: string | null;
  parentId?: string | null;
  parent?: HsnCode | null;
  children?: HsnCode[];
  level: HsnLevel;
  unit?: string | null;
  isLeaf: boolean;
  statusId?: string | null;
  status?: HsnStatus | null;
  source: string;
  sourceCode?: string | null;
  sourceRecordId?: string | null;
  sourceUpdatedAt?: string | null;
  lastSyncedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  mappedCategoriesCount?: number;
}

export interface HsnTreeNode extends HsnCode {
  children?: HsnTreeNode[];
}

export interface ProductCategoryStatus {
  id: string;
  type: string;
  code: string;
  name: string;
  isActive: boolean;
}

export interface ProductCategory {
  id: string;
  parentId?: string | null;
  parent?: ProductCategory | null;
  children?: ProductCategory[];
  name: string;
  code: string;
  slug: string;
  description?: string | null;
  icon?: string | null;
  imageUrl?: string | null;
  path?: string | null;
  level: number;
  sortOrder: number;
  isSystem: boolean;
  statusId?: string | null;
  status?: ProductCategoryStatus | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  childrenCount?: number;
  mappedHsnsCount?: number;
}

export interface CategoryTreeNode extends ProductCategory {
  children?: CategoryTreeNode[];
}

export interface CategoryBreadcrumbItem {
  id: string;
  name: string;
  code: string;
  slug: string;
  level: number;
}

export interface HsnCodeCategoryMapping {
  id: string;
  hsnCodeId: string;
  hsnCode?: HsnCode;
  productCategoryId: string;
  productCategory?: ProductCategory;
  isPrimary: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MasterSyncRun {
  id: string;
  masterType: string;
  source: string;
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';
  totalRecords: number;
  insertedRecords: number;
  updatedRecords: number;
  unchangedRecords: number;
  deactivatedRecords: number;
  failedRecords: number;
  startedAt?: string | null;
  completedAt?: string | null;
  errorMessage?: string | null;
  createdAt: string;
}

export interface MasterSyncError {
  id: string;
  syncRunId: string;
  rowNumber?: number | null;
  sourceCode?: string | null;
  errorType: string;
  errorMessage: string;
  rawData?: Record<string, any> | null;
  createdAt: string;
}

export interface CreateProductCategoryInput {
  name: string;
  code?: string;
  slug?: string;
  parentId?: string | null;
  description?: string;
  icon?: string;
  imageUrl?: string;
  sortOrder?: number;
  isSystem?: boolean;
  status?: string;
  statusId?: string;
}

export interface UpdateProductCategoryInput extends Partial<CreateProductCategoryInput> {}

export interface MoveProductCategoryInput {
  targetParentId: string | null;
}

export interface CreateHsnCodeInput {
  code: string;
  name: string;
  description?: string;
  parentId?: string | null;
  level?: HsnLevel;
  unit?: string;
  status?: string;
  statusId?: string;
  source?: string;
  sourceCode?: string;
  sourceRecordId?: string;
}

export interface UpdateHsnCodeInput extends Partial<CreateHsnCodeInput> {}

export interface MapHsnCategoryInput {
  hsnCodeId: string;
  productCategoryId: string;
  isPrimary?: boolean;
}
