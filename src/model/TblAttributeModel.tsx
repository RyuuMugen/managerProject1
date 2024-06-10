import { TblAttributeValueModel } from "./TblAttributeValueModel";
import { TblCategoryModel } from "./TblCategoryModel";

export interface TblAttributeModel {
    id: number;
    attributeCode: string | null;
    attributeName: string | null;
    filterCode: string | null;
    description: string | null;
    orderNumber: number | null;
    countAttr: number | null;
    status: string | null;
    creationDate: string | null;
    createdBy: string | null;
    lastUpdateDate: string | null;
    lastUpdatedBy: string | null;
    lastUpdatedLogin: string | null;
    attributeGroup: string | null;
    filterProdStatus: string | null;
    titleGroupStatus: string | null;
    shortDescStatus: string | null;
    displayInTechStatus: string | null;
    configProdStatus: string | null;
    tblAttributeValueModels: TblAttributeValueModel[] | null;
    tblCategoryModels: TblCategoryModel[] | null;
}