export interface TblCollection {
  id: number;
  title: string | null;
  description: string | null;
  config?: string | null;
  productCount?: number | null;
  status: string | null;
  fromTime?: string | null;
  toTime?: string | null;
  createDate?: string | null;
  createdBy?: string | null;
  lastUpdateDate?: string | null;
  lastUpdatedBy?: string | null;
  parentId?: number | null;
  metaTitle: string | null;
  metaKeyword: string | null;
  metaDescription: string | null;
  tblComboSetCollectionModels: TblCollection[] | [];
  tblComboSetCollectionProdModels: TblCollectionProduct[] | [];
  tblComboSetCollectionCommands: TblCollection[] | [];
  tblComboSetCollectionProdCommands: TblCollectionProduct[] | [];
}

export interface TblCollectionProduct {
  id?: number;
  prodId: number;
  setId?: number;
  ordering?: number;
  createDate?: string | null;
  createdBy?: null;
  lastUpdateDate?: string | null;
  lastUpdatedBy?: string | null;
}
