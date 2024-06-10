export interface TblAttributeValueCommand {
    id: number;
    attributeId: number | null;
    value: string | null;
    description: string | null;
    orderNumber: number | null;
    status: string | null;
    creationDate: Date | null;
    createdBy: string | null;
    lastUpdateDate: Date | null;
    lastUpdatedBy: string | null;
    lastUpdatedLogin: string | null;
}