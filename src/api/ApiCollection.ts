import { AxiosResponse } from "axios";
import api from "../library/axios";
import { API_ROUTE } from "../const/apiRoute";
import { NotificationExtension } from "../_base/extension/NotificationExtension";
import { HanderResponse } from "../_base/helper/FunctionHelper";
import { isNullOrUndefined } from "../_base/extension/StringExtension";
import { TblCollection } from "../model/TblComboSetCollection";
export const getListCollection = async (query: string): Promise<any> => {
  try {
    const response: AxiosResponse = await api.get(
      `${API_ROUTE.GET_LIST_COLLECTION}?${query}`
    );
    return response.data;
  } catch (error) {
    HanderResponse(error);
  }
};

export const createCollection = async (data: TblCollection): Promise<any> => {
  try {
    const response: AxiosResponse = await api.post(
      API_ROUTE.CREATE_COLLECTION,
      data
    );
    if (!isNullOrUndefined(response) && response?.data?.success) {
      NotificationExtension.Success("Thêm mới bộ sưu tập thành công !");
    } else if (response != null)
      NotificationExtension.Fails("Thêm mới bộ sưu tập thất bại !");
    return response.data;
  } catch (error) {
    HanderResponse(error);
  }
};

export const editCollection = async (data: TblCollection): Promise<any> => {
  try {
    const response: AxiosResponse = await api.post(
      API_ROUTE.EDIT_COLLECTION,
      data
    );
    if (!isNullOrUndefined(response) && response?.data?.success) {
      NotificationExtension.Success("Sửa bộ sưu tập thành công !");
    } else if (response != null)
      NotificationExtension.Fails("Sửa bộ sưu tập thất bại !");
    return response.data;
  } catch (error) {
    HanderResponse(error);
  }
};

export const deleteCollection = async (data: any): Promise<any> => {
  try {
    const response: AxiosResponse = await api.post(
      API_ROUTE.DELETE_COLLECTION,
      data
    );
    if (!isNullOrUndefined(response) && response?.data?.success) {
      NotificationExtension.Success("Xoá bộ sưu tập thành công !");
    } else if (response != null)
      NotificationExtension.Fails("Xoá bộ sưu tập thất bại !");
    return response.data;
  } catch (error) {
    HanderResponse(error);
  }
};
