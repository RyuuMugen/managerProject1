export interface tblProvince {
  provinceId: number;
  provinceCode: string | null;
  provinceName: string | null;
  creationDate?: string;
  createdBy?: string;
  lastUpdateDate?: string;
  lastUpdatedBy?: string;
  lastUpdateLogin?: string | null;
}

export interface tblDistrict {
  districtId: number;
  districtCode: string | null;
  districtName: string | null;
  provinceId: number;
  provinceCode: string | null;
  provinceName: string | null;
  creationDate?: string;
  createdBy?: string;
  lastUpdateDate?: string;
  lastUpdatedBy?: string;
  lastUpdateLogin?: string | null;
}

export interface tblCommune {
  communeId: number;
  communeCode: string | null;
  communeName: string | null;
  communeType: string | null;
  communeNameEn: string | null;
  provinceCode: string | null;
  provinceName: string | null;
  districtId: number;
  districtCode: string | null;
  districtName: string | null;
  creationDate?: string;
  createdBy?: string;
  lastUpdateDate?: string;
  lastUpdatedBy?: string;
  lastUpdateLogin?: string | null;
}
