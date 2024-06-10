import { TblItemCommand } from "./ProductList";

export interface TradeInProductCat {
  id: number;
  categoryCode: string | null;
  categoryName: string | null;
  parentId: number | null;
  icon: string | null;
  urlRedirect: string | null;
  menuLevel: number | null;
  itemQuantity: number | null;
  tradeInProductCatChilds: TradeInProductCat[] | [];
}

export interface TblTradeInHeaderCat {
  itemCatId: number;
  tblTradeInHeader: TblTradeInHeader[] | [];
}

export interface TblTradeInHeader {
  id: number;
  catId: number;
  option: string | null;
  productCondition: string | null;
  method: number | null;
  measure: string | null;
  amountSupport: number | null;
  percentSupport: number | null;
  createdBy?: string | null;
  creationDate?: string | null;
  lastUpdateBy?: string | null;
  lastUpdateDate?: string | null;
  tblTradeInLines?: TblTradeInLine[] | [];
  tblTradeInLineModels?: TblTradeInLine[] | [];
}

export interface TblTradeInLine {
  id: number;
  tradeInHeaderId: number;
  description: string | null;
  orderNumber: number | null;
  measure: string | null;
  amount: number | null;
  percent: number | null;
  createdBy?: string | null;
  creationDate?: string | null;
  lastUpdateBy?: string | null;
  lastUpdateDate?: string | null;
}

export interface TblTradeInOrder {
  id: number;
  type: string | null;
  code: string | null;
  codeUpgrade: string | null;
  cusName: string | null;
  cusEmail: string | null;
  mobileNumber: string | null;
  ipAddress: string | null;
  productName: string | null;
  productCondition: string | null;
  accessory: string | null;
  estimate: number | null;
  description: string | null;
  itemCode: string | null;
  itemId: number | null;
  itemUpgradeId: number | null;
  itemUpgradeCode: string | null;
  orgId: string | null;
  status: string | null;
  note: string | null;
  createdBy?: string | null;
  creationDate?: string | null;
  lastUpdateBy?: string | null;
  lastUpdateDate?: string | null;
  linkIndex?: string | null;
  linkIndexUpdate?: string | null;
  itemNameUpdate?: string | null;
  itemPriceUpdate?: number | null;
  storeAddress?: string | null;
  storeName?: string | null;
}

export interface TblTradeInProduct {
  id: number;
  catId: number | null;
  itemId: number | null;
  orderNumber: number;
  active: string | null;
  item: TblItemCommand;
  tblTradeInHeaderModels: TblTradeInHeader[];
  createdBy?: string | null;
  creationDate?: string | null;
  lastUpdateBy?: string | null;
  lastUpdateDate?: string | null;
}

export interface TblTradeInProductEdit {
  id: number;
  catId: number;
  itemId: number;
  orderNumber: number;
  active: string | null;
  createdBy?: string | null;
  creationDate?: string | null;
  lastUpdateBy?: string | null;
  lastUpdateDate?: string | null;
}
