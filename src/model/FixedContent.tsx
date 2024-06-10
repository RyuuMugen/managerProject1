export interface tblFixedContentType {
  id: number;
  name?: string;
  description?: string;
  image?: string | File | null;
  parentId?: number | null;
  status?: string | null;
  orderNumber?: number | null;
  metaTitle: string;
  metaKeyword: string;
  metaDescription: string;
  creationDate?: string;
  createdBy?: string;
  lastUpdateDate?: string;
  lastUpdatedBy?: string;
}

export interface tblFixedContent {
  id: number;
  title?: string;
  linkIndex?: string;
  description?: string;
  contentTypeId?: number | null;
  image?: string | File | null;
  templateContent?: string | null;
  content?: string;
  status?: string | null;
  metaTitle: string;
  metaKeyword: string;
  metaDescription: string;
  creationDate?: string;
  createdBy?: string;
  lastUpdateDate?: string;
  lastUpdatedBy?: string;
}
