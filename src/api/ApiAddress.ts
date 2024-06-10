import { AxiosResponse } from "axios";
import api from "../library/axios";
import { API_ROUTE } from "../const/apiRoute";
import { HanderResponse } from "../_base/helper/FunctionHelper";
import { NotificationExtension } from "../_base/extension/NotificationExtension";
import { isNullOrUndefined } from "../_base/extension/StringExtension";

export const getDataCommune = async (query: string): Promise<any> => {
  try {
    const response: AxiosResponse = await api.get(
      `${API_ROUTE.GET_LIST_COMMUNE}?${query}`
    );
    return response.data;
  } catch (error) {
    HanderResponse(error);
  }
};

export const getDataProvice = async (query: string): Promise<any> => {
  try {
    const response: AxiosResponse = await api.get(
      `${API_ROUTE.GET_LIST_PROVINCE}?${query}`
    );
    return response.data;
  } catch (error) {
    HanderResponse(error);
  }
};

export const createDataProvince = async (data: any): Promise<any> => {
  try {
    const response: AxiosResponse = await api.post(
      API_ROUTE.CREATE_PROVINCE,
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

export const createDataDistrict = async (data: any): Promise<any> => {
  try {
    const response: AxiosResponse = await api.post(
      API_ROUTE.CREATE_DISTRICT,
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

export const createDataCommune = async (data: any): Promise<any> => {
  try {
    const response: AxiosResponse = await api.post(
      API_ROUTE.CREATE_COMMUNE,
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

export const modifyDataProvice = async (data: any): Promise<any> => {
  try {
    const response: AxiosResponse = await api.post(
      API_ROUTE.MODIFY_PROVINCE,
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

export const modifyDataDistrict = async (data: any): Promise<any> => {
  try {
    const response: AxiosResponse = await api.post(
      API_ROUTE.MODIFY_DISTRICT,
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

export const modifyDataCommune = async (data: any): Promise<any> => {
  try {
    const response: AxiosResponse = await api.post(
      API_ROUTE.MODIFY_COMMUNE,
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

export const getDataDistrict = async (query: string): Promise<any> => {
  try {
    const response: AxiosResponse = await api.get(
      `${API_ROUTE.GET_LIST_DISTRICT}?${query}`
    );
    return response.data;
  } catch (error) {
    HanderResponse(error);
  }
};

export const deleteProvince = async (data: any): Promise<any> => {
  try {
    const response: AxiosResponse = await api.post(
      API_ROUTE.DELETE_PROVINCE,
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

export const deleteDistrict = async (data: any): Promise<any> => {
  try {
    const response: AxiosResponse = await api.post(
      API_ROUTE.DELETE_DISTRICT,
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

export const deleteCommune = async (data: any): Promise<any> => {
  try {
    const response: AxiosResponse = await api.post(
      API_ROUTE.DELETE_COMMUNE,
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
