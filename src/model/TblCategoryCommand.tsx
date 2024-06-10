export interface TblCategoryCommand {
  id: number;
  categroyCode: string | null;
  categroyName: string;
  idParent: number | null;
  description: string | null;
  creationDate: string | null;
  createdBy: string | null;
  lastUpdateDate: string | null;
  lastUpdatedBy: string | null;
  lastUpdateLogin: number | null;
  orgId: number | null;
  categoryType: string | null;
  content: string | null;
  tags: string | null;
  imageIcon: File | null;
  imageOwner: File | null;
  priceRange: string | null;
  visibleType: string | null;
  fixedContent: string | null;
  orderedNumber: number | null;
  urlRedirect: string | null;
  templateFile: string | null;
  visibleItemQty: number | null;
  urlCanonicalForSeo: string | null;
  linkForSeo: string | null;
  idexForSeo: string | null;
  enableChangeLink: string | null;
  metaTitle: string | null;
  metaKeyword: string | null;
  metaDescription: string | null;
}

export interface TblCategoryAttribute {
  id: number;
  attributeId?: number | null;
  categoryId?: number | null;
  orderNumber?: number | null;
  value?: string | null;
  status?: string | null;
  creationDate?: Date | null;
  createdBy?: string | null;
  lastUpdateDate?: Date | null;
  lastUpdatedBy?: string | null;
  lastUpdatedLogin?: string | null;
}

export interface CategoryCommandModel {
  tblCategoryCommand: any;
  listTblCategoryAttribute?: TblCategoryAttribute[] | null;
}

export interface CategoryTree {
  id: number;
  categoryCode: string | null;
  categoryName: string | null;
  categoryLevel: number | null;
  description: string | null;
  parentId: number | null;
  parentName: string | null;
  categoryChildModels: CategoryTree[] | [];
}
