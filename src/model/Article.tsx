export interface ArticleCategory {
  id?: number;
  code: string;
  name: string;
  linkIndex: string;
  description: string | null;
  // imageUrl: string;
  parentId?: number | null;
  status?: number | null;
  type: string;
  orderNumber?: number | null;
  creationDate?: string;
  createdBy?: string;
  lastUpdateDate?: string;
  lastUpdatedBy?: string;
  metaTitle: string;
  metaKeyword: string;
  metaDescription: string;
  note: string;
}

export interface ArticleList {
  id?: number | null;
  type?: string;
  title: string;
  videoCode: string;
  externalUrl: string;
  url: string;
  requestPath: string;
  urlHash: string;
  thumnail: string | File | null;
  imageBackground: string | File | null;
  extend: string;
  content: string | null;
  summary: string;
  tags: string;
  creationDate?: string;
  createdBy?: string;
  lastUpdateDate?: string;
  lastUpdatedBy?: string;
  ordering?: number | null;
  reviewRate?: number | null;
  reviewCount?: number | null;
  status?: number | null;
  visit?: number | null;
  likeCount?: number | null;
  isFeatured?: number | null;
  approvedStatus?: string | null;
  metaTitle: string;
  metaKeywords: string;
  metaDescription: string;
  commentCount?: number | null;
  commentRate?: number | null;
  postedDate?: string | null;
  isStricking: string;
  tblArticleImageCommands: ArticleImage[];
  tblArticleCategoryDetModels: ArticleCategory[];
  listCategoryId: number | number[];
}

export interface ArticleImage {
  id?: number;
  articleId: number;
  caption: string;
  fileLocation: string;
  creationDate: string;
  createdBy: string;
  lastUpdateDate: string;
  lastUpdatedBy: string;
}
export interface ArticleCategory {
  id?: number;
  articleId?: number;
  catId?: number;
  createdBy?: string;
  creationDate?: string;
  lastUpdateDate?: string;
  lastUpdatedBy?: string;
}
