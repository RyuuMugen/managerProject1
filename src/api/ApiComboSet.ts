import { AxiosResponse } from "axios";
import api from "../library/axios";
import { API_ROUTE } from "../const/apiRoute";
import { NotificationExtension } from "../_base/extension/NotificationExtension";
import { HanderResponse } from "../_base/helper/FunctionHelper";
import { tblComboSetGroupModels } from "../model/Comboset";
import { isNullOrUndefined } from "../_base/extension/StringExtension";

export const createComboSet = async (data: any): Promise<any> => {
  try {
    const response: AxiosResponse = await api.post(
      API_ROUTE.CREATE_COMBO_SET,
      data
    );
    if (!isNullOrUndefined(response) && response?.data?.success) {
      NotificationExtension.Success("Thêm mới thành công !");
    } else if (response != null)
      NotificationExtension.Fails("Thêm mới thất bại !");
    return response.data;
  } catch (error) {
    HanderResponse(error);
  }
};

export const deleteComboSet = async (data: any): Promise<any> => {
  try {
    const response: AxiosResponse = await api.post(
      API_ROUTE.DELETE_COMBO_SET,
      data
    );
    if (!isNullOrUndefined(response) && response?.data?.success) {
      NotificationExtension.Success("Xóa thành công !");
    } else if (response != null) NotificationExtension.Fails("Xóa thất bại !");
    return response.data;
  } catch (error) {
    HanderResponse(error);
  }
};

export const modifyComboSet = async (data: any): Promise<any> => {
  try {
    const editData: any = {};
    for (const key in data) {
      if (key !== "tblComboSetGroupCommands") {
        editData[key] = (data as any)[key];
      } else {
        if (data.tblComboSetGroupModels) {
          editData.tblComboSetGroupCommands = data.tblComboSetGroupCommands.map(
            (group: tblComboSetGroupModels) => {
              const { tblComboSetProdModels, ...restGroup } = group;
              return {
                ...restGroup,
                tblComboSetProdCommands: group.tblComboSetProdCommands
                  ? group.tblComboSetProdCommands
                  : tblComboSetProdModels,
              };
            }
          );
        }
      }
    }

    const response: AxiosResponse = await api.post(
      API_ROUTE.MODIFY_COMBO_SET,
      editData
    );
    if (!isNullOrUndefined(response) && response?.data?.success) {
      NotificationExtension.Success("Chỉnh sửa thành công !");
    } else if (response != null)
      NotificationExtension.Fails("Chỉnh sửa thất bại !");
    return response.data;
  } catch (error) {
    HanderResponse(error);
  }
};
