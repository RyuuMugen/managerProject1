export interface TblLinkRedirect {
  id: number;
  oldUrl: string | null;
  newUrl: string | null;
  redirectCode: number;
  creationDate: string | null;
  createdBy: string | null;
  lastUpdateDate: string | null;
  lastUpdatedBy: string | null;
  urlType: string | null;
  idPath: string | null;
}
