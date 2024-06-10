
import { TblCategoryModel } from "./TblCategoryModel";
import { TblCategoryAttributeModel } from "./TblCategoryAttributeModel";


export interface GetAttrCategoryModel {
    tblCategoryModel: TblCategoryModel;
    tblCategoryAttributeModels: TblCategoryAttributeModel[]
}