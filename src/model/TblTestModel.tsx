import { BaseEntity } from "../_base/model/_base/BaseEntity";

export interface TblTestModel extends BaseEntity {
  name: string;
  parent: number | null;
  des: string;
  inactive: boolean | null;
}
