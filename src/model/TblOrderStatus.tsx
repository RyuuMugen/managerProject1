export interface TblOrderStatus {
  id?: number;
  status: string | null;
  createdBy: string | null;
  creationDate?: string | null;
  description: string | null;
  lastUpdateBy?: string | null;
  lastUpdateDate?: string | null;
}
