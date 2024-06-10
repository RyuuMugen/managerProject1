import { AxiosResponse } from "axios";
import api from "../library/axios";
import { API_ROUTE } from "../const/apiRoute";
import { NotificationExtension } from "../_base/extension/NotificationExtension";
import { HanderResponse } from "../_base/helper/FunctionHelper";
import { isNullOrUndefined } from "../_base/extension/StringExtension";
import { tblBanner, tblBannerLocation } from "../model/TblBanner";

export const createBanner = async (data: tblBanner): Promise<any> => {
  try {
    const response: AxiosResponse = await api.post(
      API_ROUTE.CREATE_BANNER,
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

export const deleteBanner = async (data: any): Promise<any> => {
  try {
    const response: AxiosResponse = await api.post(
      API_ROUTE.DELETE_BANNER,
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

export const modifyBanner = async (data: tblBanner): Promise<any> => {
  try {
    const response: AxiosResponse = await api.put(
      API_ROUTE.MODIFY_BANNER,
      data,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
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

export const getDataBannerLocation = async (query: string): Promise<any> => {
  try {
    const response: AxiosResponse = await api.get(
      `${API_ROUTE.GET_LIST_BANNER_LOCATION}?${query}`
    );
    return response.data;
  } catch (error) {
    HanderResponse(error);
  }
};

export const createBannerLocation = async (
  data: tblBannerLocation
): Promise<any> => {
  try {
    const response: AxiosResponse = await api.post(
      API_ROUTE.CREATE_BANNER_LOCATION,
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

export const deleteBannerLocation = async (data: any): Promise<any> => {
  try {
    const response: AxiosResponse = await api.post(
      API_ROUTE.DELETE_BANNER_LOCATION,
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

export const modifyBannerLocation = async (
  data: tblBannerLocation
): Promise<any> => {
  try {
    const response: AxiosResponse = await api.put(
      API_ROUTE.MODIFY_BANNER_LOCATION,
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

export const modifyBannerOrder = async (data: any): Promise<any> => {
  try {
    const response: AxiosResponse = await api.post(
      API_ROUTE.MODIFY_BANNER_ORDER,
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
