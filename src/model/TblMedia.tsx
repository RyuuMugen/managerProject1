export interface TblMediaGroup {
  id: number;
  code: string | null;
  name: string | null;
  description: string | null;
  createdBy: string | null;
  lastUpdatedBy: string | null;
  creationDate: string | null;
  lastUpdateDate: string | null;
}

export interface TblMedia {
  mediaId: number;
  mediaCode: string | null;
  mediaName: string | null;
  linkFile: string | null;
  mediaGroup: string | null;
  mediaWidth: number | null;
  mediaHeight: number | null;
  mediaGroupId: number | null;
  uploadFile: string | File | null;
  codeHtml: string | null;
  createdBy: string | null;
  lastUpdatedBy: string | null;
  creationDate: string | null;
  lastUpdateDate: string | null;
}
