import { AxiosResponse } from "axios";
import api from "../library/axios";
import { API_ROUTE } from "../const/apiRoute";
import { HanderResponse } from "../_base/helper/FunctionHelper";
import { NotificationExtension } from "../_base/extension/NotificationExtension";
import { isNullOrUndefined } from "../_base/extension/StringExtension";

export const createDataAttribute = async (data: any): Promise<any> => {
  try {
    const response: AxiosResponse = await api.post(
      API_ROUTE.CREATE_ATTRIBUTE,
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

export const getListAttribute = async (param: string): Promise<any> => {
  try {
    const response: AxiosResponse = await api.get(
      API_ROUTE.GET_LIST_ATTRIBUTE + param
    );
    return response.data;
  } catch (error) {
    HanderResponse(error);
  }
};

export const getAllAttribute = async (param: string): Promise<any> => {
  try {
    const response: AxiosResponse = await api.get(
      API_ROUTE.GET_ALL_ATTRIBUTE + param
    );
    return response.data;
  } catch (error) {
    HanderResponse(error);
  }
};

export const modifyAttribute = async (data: any): Promise<any> => {
  try {
    const response: AxiosResponse = await api.post(
      API_ROUTE.MODIFY_ATTRIBUTE,
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

export const deleteAttribute = async (data: any): Promise<any> => {
  try {
    const response: AxiosResponse = await api.post(
      API_ROUTE.DELETE_ATTRIBUTE,
      data
    );
    NotificationExtension.Success("Xoá thành công !");
    return response.data;
  } catch (error) {
    HanderResponse(error);
  }
};

export const EditStatusActive = async (param: any): Promise<any> => {
  try {
    const response: AxiosResponse = await api.post(
      API_ROUTE.STATUS_ATTRIBUTE + param
    );
    if (!isNullOrUndefined(response) && response?.data?.success) {
      NotificationExtension.Success("Thao tác thành công !");
    } else if (response != null)
      NotificationExtension.Fails("Thao tác thất bại !");
    return response.data;
  } catch (error) {
    HanderResponse(error);
  }
};

export const EditOrderNumber = async (param: any): Promise<any> => {
  try {
    const response: AxiosResponse = await api.post(
      API_ROUTE.ORDERNUMBER_ATTRIBUTE + param
    );
    if (!isNullOrUndefined(response) && response?.data?.success) {
      NotificationExtension.Success("Thao tác thành công !");
    } else if (response != null)
      NotificationExtension.Fails("Thao tác thất bại !");
    return response.data;
  } catch (error) {
    HanderResponse(error);
  }
};

export const getDataCreateAttribute = async (): Promise<any> => {
  try {
    const response: AxiosResponse = await api.get(
      `${API_ROUTE.CREATE_ATTRIBUTE}`
    );
    return response.data;
  } catch (error) {
    HanderResponse(error);
  }
};

export const getDetailAttibute = async (id: any): Promise<any> => {
  try {
    const response: AxiosResponse = await api.post(
      `${API_ROUTE.DETAILS_ATTRIBUTE}?id=${id}`
    );
    return response.data;
  } catch (error) {
    HanderResponse(error);
  }
};

export const getListAttributeFilter = async (
  query: string | number
): Promise<any> => {
  try {
    const response: AxiosResponse = await api.get(
      API_ROUTE.GET_LIST_ATTRIBUTE_FILTER + query
    );
    return response.data;
  } catch (error) {
    console.log("error", error);
  }
};
