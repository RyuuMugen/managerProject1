export interface TblCategoryAttributeModel {
    id: number;
    attributeId: number | null;
    categoryId: number | null;
    orderNumber: number | null;
    count: number | null;
    value: string | null;
    status: string | null;
    codeAttr: string | null;
    nameAttr: string | null;
    creationDate: string | null;
    createdBy: string | null;
    lastUpdateDate: string | null;
    lastUpdatedBy: string | null;
    lastUpdatedLogin: string | null;
}