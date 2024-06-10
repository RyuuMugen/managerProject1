
export interface TblBrandCommand {
    id: number;
    brandIndex: string | null;
    name: string | null;
    summary: string | null;
    image: File | null |string;
    product: number | null;
    status: string | null;
    isFeatured: string | null;
    ordering: number | null;
    letter: string | null;
    brandPageView: number | null;
    creationDate: string | null;
    createdBy: string | null;
    lastUpdateDate: string | null;
    lastUpdatedBy: string | null;
    metaTitle: string | null;
    metaKeywords: string | null;
    metaDescription: string | null;
    description: string | null;
    priorityStatus: string | null;
}