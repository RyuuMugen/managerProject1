import { AxiosResponse } from "axios";
import api from "../library/axios";
import { API_ROUTE } from "../const/apiRoute";
import { HanderResponse } from "../_base/helper/FunctionHelper";
import { isNullOrUndefined } from "../_base/extension/StringExtension";
import { NotificationExtension } from "../_base/extension/NotificationExtension";
import { tblCustomer, tblCustomerGroup } from "../model/TblCustomer";

export const getDataCustomerGroup = async (query: string): Promise<any> => {
  try {
    const response: AxiosResponse = await api.get(
      `${API_ROUTE.GET_LIST_CUSTOMER_GROUP}?${query}`
    );
    return response.data;
  } catch (error) {
    HanderResponse(error);
  }
};

export const createCustomerGroup = async (
  data: tblCustomerGroup
): Promise<any> => {
  try {
    const response: AxiosResponse = await api.post(
      API_ROUTE.CREATE_CUSTOMER_GROUP,
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

export const deleteCustomerGroup = async (data: any): Promise<any> => {
  try {
    const response: AxiosResponse = await api.post(
      API_ROUTE.DELETE_CUSTOMER_GROUP,
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

export const modifyCustomerGroup = async (
  data: tblCustomerGroup
): Promise<any> => {
  try {
    const response: AxiosResponse = await api.put(
      API_ROUTE.MODIFY_CUSTOMER_GROUP,
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

export const createCustomer = async (data: tblCustomer): Promise<any> => {
  try {
    const response: AxiosResponse = await api.post(
      API_ROUTE.CREATE_CUSTOMER,
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

export const deleteCustomer = async (data: any): Promise<any> => {
  try {
    const response: AxiosResponse = await api.post(
      API_ROUTE.DELETE_CUSTOMER,
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

export const modifyCustomer = async (data: tblCustomer): Promise<any> => {
  try {
    const response: AxiosResponse = await api.post(
      API_ROUTE.MODIFY_CUSTOMER,
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
