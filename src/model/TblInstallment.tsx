export interface TblInstallment {
  tblInstallmentCommand: tblInstallmentCommand;
  tblInstallmentPayCommands: tblInstallmentPayCommands[];
  tblInstallmentDurationCommands: tblInstallmentDurationCommands[];
  tblInstallmentModel: tblInstallmentCommand;
  tblInstallmentPayModels: tblInstallmentPayCommands[];
  tblInstallmentDurationModels: tblInstallmentDurationCommands[];
}

export interface tblInstallmentCommand {
  id: number;
  companyCode: string | null;
  companyName: string | null;
  desciption: string | null;
  active: string | null;
  createdBy: string | null;
  creationDate: string | null;
  lastUpdateBy: string | null;
  lastUpdateDate: string | null;
}

export interface tblInstallmentPayCommands {
  id: number;
  installmentName: string | null;
  prepayment: number;
  displayOrder: number;
  createdBy?: string | null;
  creationDate?: string | null;
  lastUpdateBy?: string | null;
  lastUpdateDate?: string | null;
  installmentId: number;
}

export interface tblInstallmentDurationCommands {
  id: number;
  duration: number;
  interestRate: number;
  displayOrder: number;
  createdBy?: string | null;
  creationDate?: string | null;
  lastUpdateBy?: string | null;
  lastUpdateDate?: string | null;
  installmentId: number;
}

export interface tblInstallmentOrder {
  id: number;
  orderId: number;
  orderNumber: string | null;
  supplierName: string | null;
  installmentName: string | null;
  installmentPrice: number;
  prepaymentAmount: number;
  prepaymentPercent: number;
  interestRate: number | null;
  duration: number | null;
  customerId: number | null;
  customerName: string | null;
  customerJob: string | null;
  customerAddress: string | null;
  customerProvince: string | null;
  customerDistrict: string | null;
  customerEmail: string | null;
  telephoneNumber: string | null;
  identifyCard: string | null;
  dateOfBird: string | null;
  sex: string | null;
  brandApprovalName: string | null;
  description: string | null;
  createdBy: string | null;
  createdDate: string | null;
  lastUpdateBy: string | null;
  lastUpdateDate: string | null;
  status: string | null;
  tblInstallmentOrderDetailCommands: tblInstallmentOrderDetail[];
  tblInstallmentOrderDetailModels: tblInstallmentOrderDetail[];
}

export interface tblInstallmentOrderDetail {
  id: number;
  headerid: number;
  itemId: number;
  itemCode: string | null;
  itemUrl: string | null;
  itemName: string | null;
  itemPrice: number;
  sku: string | null;
  quantity: number;
  createdBy: string | null;
  createdDate: string | null;
  lastUpdateBy: string | null;
  lastUpdateDate: string | null;
}

export interface editInstallmentOrderStatus {
  id: number;
  status: string;
  description: string | null;
}
