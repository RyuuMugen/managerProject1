export interface tblProductAdsCategory {
  id: number;
  categoryName: string | null;
  facebookFeed: string | null;
  googleFeed: string | null;
  description: string | null;
  createdBy: string | null;
  creationDate: string | null;
  lastUpdateDate: string | null;
  lastUpdateBy: string | null;
}

export interface tblProductAdsCategoryList {
  lists: tblProductAdsCategory[] | [];
  count: number;
}

export interface tblProductAds {
  id: number;
  itemId: number | null;
  itemCode: string | null;
  catId: number | null;
  createdBy?: string | null;
  creationDate?: string | null;
  lastUpdateDate?: string | null;
  lastUpdateBy?: string | null;
}

export interface tblListProductAdsDetail {
  id: number;
  itemCode: string | null;
  itemName: string | null;
  onhandQuantity: number | null;
  unitSellingPrice: number | null;
  view: number | null;
  warrantyDescrition: string | null;
  createdBy?: string | null;
  creationDate?: string | null;
  lastUpdateDate?: string | null;
  lastUpdateBy?: string | null;
}
