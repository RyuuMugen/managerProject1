export interface TblBuildPcCatRel {
  id?: number;
  categoryId: number;
  categoryName: string | null;
  categoryRelId: number | null;
  categoryRelName: string | null;
  productCount?: number | null;
  creationDate?: string | null;
  createdBy?: string | null;
  lastUpdateDate?: string | null;
  lastUpdateBy?: string | null;
}

export interface TblBuildPcItemRel {
  id: number;
  itemId: number | null;
  relItemId: number | null;
  creationDate?: string | null;
  createdBy?: string | null;
  lastUpdateDate?: string | null;
  lastUpdateBy?: string | null;
}

export interface TblBuildPcListItemBuild {
  id: number;
  categoryId: number | null;
  itemName: string | null;
  image: string | null;
  description: string | null;
  skuCode: string | null;
  unitPrice: number | null;
  quantity: number | null;
  status: string | null;
  isRel?: boolean;
}
