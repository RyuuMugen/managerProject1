import { AxiosResponse } from "axios";
import api from "../library/axios";
import { API_ROUTE } from "../const/apiRoute";
import { HanderResponse } from "../_base/helper/FunctionHelper";
import { NotificationExtension } from "../_base/extension/NotificationExtension";
import { isNullOrUndefined } from "../_base/extension/StringExtension";

export const getDataPaymentMethod = async (query: string): Promise<any> => {
  try {
    const response: AxiosResponse = await api.get(
      `${API_ROUTE.GET_LIST_BRAND}?${query}`
    );
    return response.data;
  } catch (error) {
    HanderResponse(error);
  }
};

export const getDataBrand = async (): Promise<any> => {
  try {
    const response: AxiosResponse = await api.get(
      `${API_ROUTE.GET_LIST_BRAND}?Skip=0&Take=1000`
    );
    return response.data;
  } catch (error) {
    HanderResponse(error);
  }
};

export const createDataPayment = async (data: any): Promise<any> => {
  try {
    const response: AxiosResponse = await api.post(
      API_ROUTE.CREATE_PAYMENT,
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

export const modifyDataPayment = async (data: any): Promise<any> => {
  try {
    const response: AxiosResponse = await api.post(
      API_ROUTE.MODIFY_PAYMENT,
      data
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

export const deletePayment = async (data: any): Promise<any> => {
  try {
    const response: AxiosResponse = await api.post(
      API_ROUTE.DELETE_PAYMENT,
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

export const createDataBrand = async (data: any): Promise<any> => {
  try {
    const response: AxiosResponse = await api.post(
      API_ROUTE.CREATE_BRAND,
      data,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
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

export const modifyDataBrand = async (data: any): Promise<any> => {
  try {
    const response: AxiosResponse = await api.put(
      API_ROUTE.MODIFY_BRAND,
      data,
      { headers: { "Content-Type": "multipart/form-data" } }
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

export const deleteBrand = async (data: any): Promise<any> => {
  try {
    const response: AxiosResponse = await api.post(
      API_ROUTE.DELETE_BRAND,
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
