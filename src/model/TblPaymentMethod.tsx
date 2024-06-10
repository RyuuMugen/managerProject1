export interface TblPaymentMethod {
  paymentId: number;
  paymentCode: string | null;
  paymentName: string | null;
  startDateActive: string | Date | null;
  endDateActive: string | Date | null;
  paymentType: string | null;
  description: string | null;
  createdBy: string | null;
  lastUpdatedBy: string | null;
  creationDate: string | null;
  lastUpdateDate: string | null;
}
