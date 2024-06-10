import { AxiosResponse } from "axios";
import api from "../library/axios";
import { HanderResponse } from "../_base/helper/FunctionHelper";
import { API_ROUTE } from "../const/apiRoute";
import { isNullOrUndefined } from "../_base/extension/StringExtension";
import { NotificationExtension } from "../_base/extension/NotificationExtension";

export const getDataLinkRedirect = async (): Promise<any> => {
  try {
    const response: AxiosResponse = await api.get(
      `${API_ROUTE.GET_LIST_LINK_REDIRECT}`
    );
    return response.data;
  } catch (error) {
    HanderResponse(error);
  }
};

export const createLinkRedirect = async (data: any): Promise<any> => {
  try {
    const response: AxiosResponse = await api.post(
      API_ROUTE.CREATE_LINK_REDIRECT,
      data
    );
    if (!isNullOrUndefined(response) && response?.data?.success) {
      NotificationExtension.Success("Tạo LinkRedirect thành công");
    } else if (response != null)
      NotificationExtension.Fails("Tạo LinkRedirect thất bại !");
    return response.data;
  } catch (error) {
    HanderResponse(error);
  }
};

export const modifyLinkRedirect = async (data: any): Promise<any> => {
  try {
    const response: AxiosResponse = await api.post(
      API_ROUTE.MODIFY_LINK_REDIRECT,
      data
    );
    if (!isNullOrUndefined(response) && response?.data?.success) {
      NotificationExtension.Success("Chỉnh sửa LinkRedirect thành công");
    } else if (response != null)
      NotificationExtension.Fails("Chỉnh sửa LinkRedirect thất bại !");
    return response.data;
  } catch (error) {
    HanderResponse(error);
  }
};

export const deleteLinkRedirect = async (data: any): Promise<any> => {
  try {
    const response: AxiosResponse = await api.post(
      API_ROUTE.DELETE_LINK_REDIRECT,
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
