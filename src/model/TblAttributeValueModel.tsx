export interface TblAttributeValueModel {
  id: number;
  attributeId: number | null;
  value: string | null;
  description: string | null;
  orderNumber: number | null;
  countAttr: number | null;
  status: string | null;
  creationDate: string | null;
  createdBy: string | null;
  lastUpdateDate: string | null;
  lastUpdatedBy: string | null;
  lastUpdatedLogin: string | null;
}

export interface TblAttributeFilter {
  id: number;
  attributeName: string | null;
  attributeValues: attributeValue[] | [];
}

export interface attributeValue {
  id: number;
  value: string;
  attributeId: number;
}

export interface AttributeOptionType {
  value: string;
  label: string;
}

export interface TblAttributeFilterOption {
  id: number;
  attributeName: string | null;
  options: AttributeOptionType[];
}
