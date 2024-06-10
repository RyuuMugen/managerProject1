export interface TblItemCommand {
  orgId?: number;
  id: number;
  parentId?: number | null;
  barcode?: string | null;
  itemCode?: string | null;
  itemName?: string | null;
  itemCost?: number | null;
  inUse?: string | null;
  barcodeUsed?: string | null;
  shortName?: string | null;
  discountValue?: number | null;
  warrantyByPartner?: string | null;
  warrantyByCus?: string | null;
  vat?: number | null;
  isPromotional?: string | null;
  accessory?: string | null;
  fullModelCode?: string | null;
  profit?: number | null;
  categoryId?: number | null;
  createdBy?: string | null;
  lastUpdateDate?: string | null;
  lastUpdatedBy?: string | null;
  lastUpdateLogin?: string | null;
  creationDate?: string | null;
  attribute1?: string | null;
  attribute2?: string | null;
  attribute3?: string | null;
  attribute4?: string | null;
  attribute5?: string | null;
  attribute6?: string | null;
  attribute7?: string | null;
  attribute8?: string | null;
  attribute9?: string | null;
  attribute10?: string | null;
  attribute11?: string | null;
  attribute12?: string | null;
  attribute13?: string | null;
  attribute14?: string | null;
  attribute15?: string | null;
  erpInventoryItemId?: number | null;
  marketPrice?: number | null;
  unitWeight?: number | null;
  weightUomCode?: string | null;
  volumeUomCode?: string | null;
  unitVolume?: number | null;
  primaryUomCode?: string | null;
  primaryUnitOfMeasure?: string | null;
  dimensionUomCode?: string | null;
  unitLength?: number | null;
  unitWidth?: number | null;
  unitHeight?: number | null;
  secondaryUomCode?: string | null;
  unitSellingPrice?: number | null;
  longName?: string | null;
  warrantyDescrition?: string | null;
  sku?: string | null;
  onhandQuantyty?: number | null;
  color?: string | null;
  sex?: string | null;
  style?: string | null;
  purpose?: string | null;
  urlCanonical?: string | null;
  metaTitle?: string | null;
  metaKeyword?: string | null;
  metaDescription?: string | null;
  tag?: string | null;
  description?: string | null;
  unitPriceReference?: number | null;
  brandId?: number | null;
  newStatus?: string | null;
  hotStatus?: string | null;
  bestSaleStatus?: string | null;
  saleOffStatus?: string | null;
  onlineStatus?: string | null;
  orderNumber?: number | null;
  view?: number | null;
  itemSpec?: string | null;
  primaryImage?: string | null;
  url?: string | null;
}

export interface TblItemCategoryCommand {
  id?: number | null;
  categoryCode?: string | null;
  categoryName?: string | null;
  idParent?: number | null;
  description?: string | null;
  createdBy?: string | null;
  lastUpdateDate?: string | null;
  lastUpdatedBy?: string | null;
  lastUpdateLogin?: string | null;
  orgId?: number | null;
  creationDate?: string | null;
  itemId?: number | null;
  categoryId?: number | null;
}

export interface TblItemSeoCommand {
  id?: number | null;
  categoryCode?: string | null;
  categoryName?: string | null;
  idParent?: number | null;
  description?: string | null;
  createdBy?: string | null;
  lastUpdateDate?: string | null;
  lastUpdatedBy?: string | null;
  lastUpdateLogin?: string | null;
  orgId?: number | null;
  invItemId?: number | null;
  categoryId?: number | null;
  creationDate?: string | null;
}

export interface TblItemTechnicalCommonCommand {
  id?: number | null;
  itemTecCode?: string | null;
  itemTecName?: string | null;
  description?: string | null;
  createdBy?: string | null;
  lastUpdateDate?: string | null;
  lastUpdatedBy?: string | null;
  lastUpdateLogin?: string | null;
  orgId?: number | null;
  invItemId?: number | null;
  technicalCommonId?: number | null;
  creationDate?: string | null;
}

export interface TblItemImageCommand {
  id?: number | null;
  imageCode?: string | null;
  imageName?: string | null;
  description?: string | null;
  orderNumber?: number | null;
  orgId?: number | null;
  invItemId?: number | null;
  image: string | File | null;
  imagePath?: string | null;
  primaryImg?: string | null;
  creationDate?: string | null;
  createdBy?: string | null;
  lastUpdateDate?: string | null;
  lastUpdatedBy?: string | null;
  lastUpdateLogin?: string | null;
  imageWidth?: number | null;
  imageHeight?: number | null;
}

export interface TblItemCategoryAttrModel {
  id?: number | null;
  itemId?: number | null;
  categoryId?: number | null;
  attributeId?: number | null;
  attributeValueId?: number | null;
  orderNumber?: number | null;
  value?: string | null;
  status?: string | null;
  creationDate?: string | null;
  createdBy?: string | null;
  lastUpdateDate?: string | null;
  lastUpdatedBy?: string | null;
  lastUpdatedLogin?: string | null;
}

export interface TblItemYoutubeCommand {
  id?: number | null;
  linkYoutube?: string | null;
  description?: string | null;
  createdBy?: string | null;
  lastUpdateDate?: string | null;
  lastUpdatedBy?: string | null;
  lastUpdateLogin?: string | null;
  orgId?: number | null;
  itemId?: number | null;
}

export interface tblTagItemModels {
  id?: number | null;
  itemType?: string | null;
  itemId?: number | null;
  tagId?: number | null;
  createdBy?: string | null;
  creationDate?: string | null;
  lastUpdateDate?: string | null;
  lastUpdatedBy?: number | null;
}

export interface TblItem {
  tblItemCommand?: TblItemCommand | null;
  tblItemCategoryCommands?: TblItemCategoryCommand[] | null;
  tblItemSeoCommands?: TblItemSeoCommand[] | null;
  tblItemTechnicalCommonCommands?: TblItemTechnicalCommonCommand[] | null;
  tblItemImageCommands?: TblItemImageCommand[] | null;
  tblItemCategoryAttrModels?: TblItemCategoryAttrModel[] | null;
  tblItemYoutubeCommands?: TblItemYoutubeCommand[] | null;
  tagItemIds: tblTagItemModels[] | null;
}

export interface Brand {
  id: number;
  brandIndex: string;
  name: string;
  summary: string;
  image: string | null; // Assuming the image is a URL or null
  product: number;
  status: string;
  isFeatured: string;
  ordering: number;
  letter: string;
  brandPageView: number;
  creationDate: string; // Assuming the date is in ISO format
  createdBy: string | null;
  lastUpdateDate: string | null; // Assuming the date is in ISO format
  lastUpdatedBy: string | null;
  metaTitle: string;
  metaKeywords: string;
  metaDescription: string;
  description: string;
  priorityStatus: string | null; // Adjust the type as per your actual data
}

export interface featureOption {
  id: number;
  newStatus: string;
  hotStatus: string;
  bestSaleStatus: string;
  saleOffStatus: string;
  onlineStatus: string;
}
