export interface tblSaleOrderCommand {
  id: number;
  assignToId: number | null;
  assignToName: string | null;
  orderNumber: string | null;
  orderDate: string | null;
  orderType: string | null;
  customerId: number | null;
  buyerTelephone: string | null;
  customerSiteId: number | null;
  buyerId: number | null;
  buyerEmail: string | null;
  provinceId: number | null;
  districtId: number | null;
  communeId: number | null;
  buyerName: string | null;
  buyerInfo: string | null;
  taxCode: string | null;
  taxCompany: string | null;
  taxAddress: string | null;
  totalAmount: number | null;
  orderPromotion: string | null;
  shipMethod: number | null;
  shippingStatus: string | null;
  shippingInfo: string | null;
  shippingComment: string | null;
  shippingUpdateTime: string | null;
  shippingUpdateBy: string | null;
  shippingCompany: string | null;
  shippingFee: number | null;
  codfee: string | null;
  shippingNote: string | null;
  shippingAddress: string | null;
  payMethodId: number | null;
  payStatus: string | null;
  receivePayStatus: string | null;
  successStatus: string | null;
  buyerInstruction: string | null;
  description: string | null;
  buyerFeedBackId: number | null;
  discountPrice: number | null;
  discountInfo: string | null;
  orderFees: string | null;
  orderDiscount: string | null;
  discount: number | null;
  discountNote: string | null;
  orderStatus: string | null;
  orderMessage: string | null;
  orderComment: string | null;
  orderStatusDate: string | null;
  orderStatusUpdateBy: string | null;
  caresoftTicketId: number | null;
  totalRemainingAmount: number | null;
  voucherId: number | null;
  voucherValue: number | null;
  voucherCode: string | null;
  creationDate?: string | null;
  createdBy?: string | null;
  lastUpdateDate?: string | null;
  lastUpdatedBy?: string | null;
  lastUpdateLogin?: string | null;
}

export interface tblSaleOrderDetailCommands {
  id: number;
  headerId: number | null;
  itemCode?: string | null;
  itemName?: string | null;
  itemPrice?: number | null;
  itemId?: number | null;
  itemInformation?: string | null;
  quantity?: number | null;
  promotion?: string | null;
  itemImage?: string | null;
  itemUrl?: string | null;
  totalAmount?: number | null;
  itemNote?: string | null;
  itemAddmon?: string | null;
  itemSalePrice?: string | null;
  cartDetailId?: string | null;
  creationDate?: string | null;
  createdBy?: string | null;
  lastUpdateDate?: string | null;
  lastUpdatedBy?: string | null;
}

export interface tblSaleOrderHisCommands {
  id: number;
  assignDate: string | null;
  assignId: number | null;
  assignName: string | null;
  createdBy: string | null;
  creationDate: string | null;
  description: string | null;
  lastUpdateBy: string | null;
  lastUpdateDate: string | null;
  orderId: number | null;
  status: string | null;
  updateDate: string | null;
}
export interface tblSaleOrder {
  tblSaleOrderCommand: tblSaleOrderCommand;
  tblSaleOrderDetailCommands: tblSaleOrderDetailCommands[] | [];
  tblSaleOrderHisCommands: tblSaleOrderHisCommands[] | [];
  lsTblSaleOrderModel?: tblSaleOrderCommand;
  lsTblSaleOrderDetailModel?: tblSaleOrderDetailCommands[] | [];
  tblSaleOrderHisModels?: tblSaleOrderHisCommands[] | [];
}
export interface TblStatus {
  id?: number;
  status: string;
  createBy?: string;
  time?: string;
}

export interface tblAssignSaleOrders {
  orderId: number;
  assignId: number | null;
  assignName: string | null;
  description: string;
}
