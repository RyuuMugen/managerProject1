export interface ComboSetProdCommand {
  id?: number | null;
  groupId?: number | null;
  itemId?: number | null;
  discoutValue: string;
  discoutType?: number | null;
  isFirstRow: string;
  itemName?: string;
  itemPrice?: string;
  isFree: string;
  isHot: string;
  creationDate?: string;
  createdBy?: string;
  lastUpdateDate?: string;
  lastUpdatedBy?: string;
}

export interface ComboSetGroupCommand {
  id?: number | null;
  groupName: string;
  setId?: number | null;
  creationDate?: string;
  createdBy?: string;
  lastUpdateDate?: string;
  lastUpdatedBy?: string;
  tblComboSetProdCommands?: ComboSetProdCommand[];
}

export interface ComboSet {
  id?: number | null;
  setName: string;
  description: string;
  status: string;
  visible: string;
  fromDate: string;
  toDate: string;
  fromHour?: number | null;
  toHour?: number | null;
  isActualStore: string;
  creationDate?: string;
  createdBy?: string;
  lastUpdateDate?: string;
  lastUpdateBy?: string;
  tblComboSetGroupCommands?: ComboSetGroupCommand[];
}

export interface TblComboSet {
  id?: number | null;
  setName: string;
  description: string;
  status: string;
  visible: string;
  fromDate: string;
  toDate: string;
  fromHour?: number | null;
  toHour?: number | null;
  isActualStore: string;
  creationDate?: string;
  createdBy?: string;
  lastUpdateDate?: string;
  lastUpdateBy?: string;
  tblComboSetGroupModels?: tblComboSetGroupModels[];
}

export interface tblComboSetGroupModels {
  id?: number | null;
  groupName: string;
  setId?: number | null;
  creationDate?: string;
  createdBy?: string;
  lastUpdateDate?: string;
  lastUpdatedBy?: string;
  tblComboSetProdModels?: ComboSetProdCommand[];
  tblComboSetProdCommands?: ComboSetProdCommand[];
}
