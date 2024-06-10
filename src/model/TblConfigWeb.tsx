export interface TblConfigWeb {
  id: number;
  domain?: TblConfigWebDomain;
  store?: TblConfigWebStore[];
  banner?: TblConfigWebBanner;
  page?: TblConfigWebPage;
  banIP?: TblConfigWebBanIP;
  webInfo?: TblConfigWebWebInfo;
  description: string | null;
  creationDate: string | null;
  createdBy: string | null;
  lastUpdateDate: string | null;
  lastUpdatedBy: string | null;
  lastUpdateLogin: string | null;
}

export interface TblConfigWebDomain {
  domain: string | null;
  primaryDomain: string | null;
  creationDate: string | null;
  createdBy: string | null;
  lastUpdateDate: string | null;
  lastUpdatedBy: string | null;
}

export interface TblConfigWebStore {
  id: number;
  storeID: string | null;
  storeName: string | null;
  address: string | null;
  telephone: string | null;
  provinceId: number | null;
  districtId: number | null;
  communeId: number | null;
  status: string | null;
  isActualStore: string | null;
  creationDate: string | null;
  createdBy: string | null;
  lastUpdateDate: string | null;
  lastUpdatedBy: string | null;
  image: string | null;
  linkMap: string | null;
  mapEmbeded: string |null;
  warrantyTel: string | null;
  email: string | null;
  openTime: string | null;
  closedTime: string | null;
  side: number| null;
}


export interface TblConfigWebBanner {
  logoUrl: string | File | null;
  faviconUrl: string | File | null;
  sitemapUrl: string | File | null;
  robotUrl: string | File | null;
  headerWidth: number | null;
  headerHeight: number | null;
  headerImgUrl: string | File | null;
  linkBanner: string | null;
  bannerImgUrl: string | File | null;
  visibaleType: string | null;
  status: string | null;
  visible: string | null;
  wallpaperColorCode: string | null;
  wallpaperImgUrl: string | File | null;
  other:
    | {
        code: string | null;
        name: string | null;
        creationDate: string | null;
        createdBy: string | null;
        lastUpdateDate: string | null;
        lastUpdatedBy: string | null;
      }[]
    | null;
  customDesc1: string | null;
  customTitle1: string | null;
  timeDeal: string | null;
  videoPopup: string | null;
  fanpage: string | null;
  videoMainPage: string | null;
  videoFotter: string | null;
  customTitle2: string | null;
  customDesc2: string | null;
  creationDate: string | null;
  createdBy: string | null;
  lastUpdateDate: string | null;
  lastUpdatedBy: string | null;
}

export interface TblConfigWebPage {
  closeWebsite: string | null;
  faviconUrl: string | null;
  veryfyDomain: string | null;
  qtyProdPerPage: number | null;
  orderProdBy: string | null;
  qtyArticlePerPage: number | null;
  hotProdByCat: string | null;
  qtyHotProdByCat: number | null;
  bestsaleProdByCat: string | null;
  qtyBestsaleProdByCat: number | null;
  newProdByCat: string | null;
  qtyNewProdByCat: number | null;
  saleoffProdByCat: string | null;
  qtySaleoffProdByCat: number | null;
  articleByCat: string | null;
  qtyArticleByCat: number | null;
  collectProdByCat: string | null;
  qtyCollectProdByCat: number | null;
  hotProdByCat1: string | null;
  qtyHotProdByCat1: number | null;
  bestsaleProdByCat1: string | null;
  qtyBestsaleProdByCat1: number | null;
  newProdByCat1: string | null;
  qtyNewProdByCat1: number | null;
  saleoffProdByCat1: string | null;
  qtySaleoffProdByCat1: number | null;
  articleByCat1: string | null;
  qtyArticleByCat1: number | null;
  collectProdByCat1: string | null;
  qtyCollectProdByCat1: number | null;
  thum: number | null;
  small: number | null;
  medium: number | null;
  large: number | null;
  isSquare: string | null;
  wallterMark: string | null;
  defaultTab: string | null;
  visibleAll: string | null;
  qtyProdVisible: number | null;
  creationDate: string | null;
  createdBy: string | null;
  lastUpdateDate: string | null;
  lastUpdatedBy: string | null;
}

export interface TblConfigWebBanIP {
  ipAddress: string | null;
  description: string | null;
  creationDate: string | null;
  createdBy: string | null;
  lastUpdateDate: string | null;
  lastUpdatedBy: string | null;
}

export interface TblConfigWebWebInfo {
  saleEmail: string | null;
  careEmail: string | null;
  websiteName: string | null;
  metaTitle: string | null;
  metaKeyword: string | null;
  metaDescription: string | null;
  imgUrl: string | null;
  content: string | null;
  descritpion: string | null;
  contact: string | null;
  creationDate: string | null;
  createdBy: string | null;
  lastUpdateDate: string | null;
  lastUpdatedBy: string | null;
}
