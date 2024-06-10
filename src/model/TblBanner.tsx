export interface tblBanner {
  id: number;
  code: string | null;
  name: string | null;
  bannerUrlPrimary: string | null;
  linkPage: string | null;
  bannerLocationId: number | null;
  title: string | null;
  bannerWidth: number | null;
  bannerHeight: number | null;
  fileBanner: string | File | null;
  bannerUrl: string | null;
  bannerUrlTarget: string | null;
  orderNumber: number | null;
  description: string | null;
  fromDate: string | null;
  toDate: string | null;
  fromTime: number | null;
  toTime: number | null;
  status: string | null;
  type: string | null;
  mobileStatus: string | null;
  templatePage: string | null;
  locationIndex: string | null;
  creationDate: string | null;
  createdBy: string | null;
  lastUpdateDate: string | null;
  lastUpdatedBy: string | null;
  lastUpdateLogin: string | null;
  listCategoryId: string | null;
}

export interface tblBannerLocation {
  id: number;
  templatePage: string | null;
  bannerLocCode: string | null;
  bannerLocName: string | null;
  description: string | null;
  status: string | null;
  createdBy: string | null;
  creationDate: string | null;
  lastUpdateDate: string | null;
  lastUpdatedBy: string | null;
  lastUpdateLogin: string | null;
}
