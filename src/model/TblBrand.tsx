export interface TblBrand {
  id: number;
  brandIndex: string;
  name: string;
  summary: string;
  product: number;
  status: string;
  image: string | File | null;
  isFeatured: string;
  ordering: number;
  letter: string;
  description: string;
  brandPageView: number;
  metaTitle: string;
  metaKeywords: string;
  metaDescription: string;
}
