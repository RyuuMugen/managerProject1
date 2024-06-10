export interface TblConfigGroup {
  id: number;
  name: string | null;
  description: string | null;
  searchFulltext: string | null;
  configGroupType: string | null;
  tblConfigGroupAttributeModels?: TblConfigGroupAttribute[] | [];
  tblConfigGroupProductModels?: TblConfigGroupProduct[] | [];
  creationDate?: string | null;
  createdBy?: string | null;
  lastUpdateDate?: string | null;
  lastUpdatedBy?: string | null;
  lastUpdateLogin?: string | null;
}

export interface TblConfigGroupAttribute {
  id: number;
  name: string | null;
  groupId: number | null;
  orderNumber: number | null;
  tblConfigGroupAttributeValueModels?: TblConfigGroupAttributeValue[] | [];
  creationDate?: string | null;
  createdBy?: string | null;
  lastUpdateDate?: string | null;
  lastUpdatedBy?: string | null;
}

export interface TblConfigGroupAttributeValue {
  id: number;
  name: string | null;
  description: string | null;
  attrId: number | null;
  ordering: number | null;
  image: string | null;
  colorCode: string | null;
  creationDate?: string | null;
  createdBy?: string | null;
  lastUpdateDate?: string | null;
  lastUpdatedBy?: string | null;
}

export interface TblConfigGroupProduct {
  id: number;
  productId: number | null;
  itemName: string | null;
  groupId: number | null;
  attributeValueId: number | null;
  attributeId: number | null;
  attributeConfig: string | null;
  creationDate?: string | null;
  createdBy?: string | null;
  lastUpdateDate?: string | null;
  lastUpdatedBy?: string | null;
}
