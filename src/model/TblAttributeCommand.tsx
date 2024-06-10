import { TblAttributeValueCommand } from "./TblAttributeValueCommand";

export interface TblAttributeCommand {
    id: number;
    attributeCode: string | null;
    attributeName: string | null;
    filterCode: string | null;
    description: string | null;
    orderNumber: number | null;
    status: string | null;
    creationDate: Date | null;
    createdBy: string | null;
    lastUpdateDate: Date | null;
    lastUpdatedBy: string | null;
    lastUpdatedLogin: string | null;
    attributeGroup: string | null;
    filterProdStatus: string | null|boolean;
    titleGroupStatus: string | null |boolean;
    shortDescStatus: string | null|boolean;
    displayInTechStatus: string | null|boolean;
    configProdStatus: string | null|boolean;
    listTblAttributeValueCommand: TblAttributeValueCommand[] | null;
}