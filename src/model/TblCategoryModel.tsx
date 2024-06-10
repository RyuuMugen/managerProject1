import { SelectListItemBase } from "../_base/model/_base/SelectListItemBase";

export interface TblCategoryModel {
  id: number;
  categoryCode: string | null;
  categoryName: string;
  idParent: number | null;
  description: string | null;
  isBuildPc: string | null;
  isMegaMenu: string | null;
  creationDate: string | null;
  createdBy: string | null;
  lastUpdateDate: string | null;
  lastUpdatedBy: string | null;
  lastUpdateLogin: number | null;
  orgId: number | null;
  categoryType: string | null;
  content: string | null;
  tags: string | null;
  imageIcon: File | null | string;
  imageOwner: File | null | string;
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
  itemCount: number;
  status: string | null;
  priorityStatus: string | null;
  tblCategoryModels: SelectListItemBase[];
  categoryTreeModels: SelectListItemBase[];
  // tblCategoryAttributeModel: SelectListItemBase[] | null;
  tblCategoryImageModels: listTblCategoryImage[] | null;
  listTblCategoryImage: listTblCategoryImage[] | null;
  listTblCategoryAttribute: listTblCategoryAttribute[] | [];
  tblCategoryAttributeModel?: listTblCategoryAttribute[] | null;
  brandIds: number[] | null;
  isTradeIn?: string | null;
}

export interface listTblCategoryImage {
  id?: number;
  imageCode: string | null;
  imageName: string | null;
  description: string | null;
  image: string | File | null;
  status: string | null;
  title: string | null;
  linkUrl: string | null;
  imageGroup: string | null;
  orgId: number | null;
  categoryId: number | null;
  createdBy: string | null;
  lastUpdateDate: string | null;
  lastUpdatedBy: string | null;
  lastUpdateLogin: number | null;
}

export interface listTblCategoryAttribute {
  id?: number;
  attributeId: number | null;
  categoryId: number | null;
  orderNumber: number | null;
  value: string | null;
  status: string | null;
  creationDate: number | null;
  createdBy: string | null;
  lastUpdateDate: string | null;
  lastUpdatedBy: string | null;
  lastUpdateLogin: number | null;
}
