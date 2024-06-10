import { AxiosResponse } from "axios";
import api from "../library/axios";
import { HanderResponse } from "../_base/helper/FunctionHelper";
import { API_ROUTE } from "../const/apiRoute";
import { isNullOrUndefined } from "../_base/extension/StringExtension";
import { NotificationExtension } from "../_base/extension/NotificationExtension";

export const getDataProductDeal = async (): Promise<any> => {
  try {
    const response: AxiosResponse = await api.get(
      `${API_ROUTE.GET_LIST_PRODUCT_DEAL}`
    );
    return response.data;
  } catch (error) {
    HanderResponse(error);
  }
};

export const createProductDeal = async (data: any): Promise<any> => {
  try {
    const response: AxiosResponse = await api.post(
      API_ROUTE.CREATE_PRODUCT_DEAL,
      data
    );
    if (!isNullOrUndefined(response) && response?.data?.success) {
      NotificationExtension.Success("Tạo Deal thành công");
    } else if (response != null)
      NotificationExtension.Fails("Tạo Deal thất bại !");
    return response.data;
  } catch (error) {
    HanderResponse(error);
  }
};

export const modifyProductDeal = async (data: any): Promise<any> => {
  try {
    const response: AxiosResponse = await api.post(
      API_ROUTE.MODIFY_PRODUCT_DEAL,
      data
    );
    if (!isNullOrUndefined(response) && response?.data?.success) {
      NotificationExtension.Success("Chỉnh sửa Deal thành công");
    } else if (response != null)
      NotificationExtension.Fails("Chỉnh sửa Deal thất bại !");
    return response.data;
  } catch (error) {
    HanderResponse(error);
  }
};

export const deleteProductDeal = async (data: any): Promise<any> => {
  try {
    const response: AxiosResponse = await api.post(
      API_ROUTE.DELETE_PRODUCT_DEAL,
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
