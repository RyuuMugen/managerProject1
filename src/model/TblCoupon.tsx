export interface TblCoupon {
  id?: number;
  code: string | null;
  codeType: string | null;
  title: string | null;
  description: string | null;
  type: string | null;
  content: string | null;
  validOrderValue: number | null;
  fromDate: Date | string | null;
  toDate: Date | string | null;
  fromTime: number | null;
  toTime: number | null;
  limitUsePerUser: number | null;
  limitTotalAmountMin: number | null;
  total: number | null;
  orderCondition: string | null;
  totalUse: number | null;
  canUseWithOther: number | null;
  showToPublic: number | null;
  status: number | null;
  createdBy: null;
  lastUpdateDate: Date | string | null;
  lastUpdatedBy: string | null;
  lastUpdateLogin: string | null;
}
