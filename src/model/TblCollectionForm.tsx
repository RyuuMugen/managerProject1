export interface TblCollectionForm {
  id: number;
  fullname: string | null;
  mobile: string | null;
  email: string | null;
  productName: string | null;
  productId: number | null;
  keyword: string | null;
  creationDate?: string | null;
  createdBy?: string | null;
  lastUpdateDate?: string | null;
  lastUpdatedBy?: string | null;
}
