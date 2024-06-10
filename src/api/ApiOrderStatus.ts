import { AxiosResponse } from "axios";
import { API_ROUTE } from "../const/apiRoute";
import { NotificationExtension } from "../_base/extension/NotificationExtension";
import { HanderResponse } from "../_base/helper/FunctionHelper";
import apiUrl from "../library/axiosUrl";
import { isNullOrUndefined } from "../_base/extension/StringExtension";

export const getDataSaleOrderStatus = async (query: string): Promise<any> => {
  try {
    const response: AxiosResponse = await apiUrl.get(
      `${API_ROUTE.GET_LIST_ORDER_STATUS}?${query}`
    );
    return response.data;
  } catch (error) {
    HanderResponse(error);
  }
};

export const createOrderDetailStatus = async (data: any): Promise<any> => {
  try {
    const response: AxiosResponse = await apiUrl.post(
      API_ROUTE.CREATE_ORDER_STATUS,
      JSON.stringify(data),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    if (!isNullOrUndefined(response) && response?.data?.success) {
      NotificationExtension.Success("Thêm mới thành công !");
    } else if (response != null)
      NotificationExtension.Fails("Thêm mới thất bại !");
    return response.data;
  } catch (error) {
    HanderResponse(error);
    console.log(error);
  }
};

export const editOrderDetail = async (data: any): Promise<any> => {
  try {
    const response: AxiosResponse = await apiUrl.put(
      API_ROUTE.MODIFY_ORDER_STATUS,
      JSON.stringify(data),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    if (!isNullOrUndefined(response) && response?.data?.success) {
      NotificationExtension.Success("Sửa thành công !");
    } else if (response != null) NotificationExtension.Fails("Sửa thất bại !");
    return response.data;
  } catch (error) {
    HanderResponse(error);
  }
};

export const deleteOrderDetailStatus = async (data: any): Promise<any> => {
  try {
    const response: AxiosResponse = await apiUrl.post(
      API_ROUTE.DELETE_ORDER_STATUS,
      data,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    if (!isNullOrUndefined(response) && response?.data?.success) {
      NotificationExtension.Success("Xóa thành công !");
    } else if (response != null) NotificationExtension.Fails("Xóa thất bại !");
    return response.data;
  } catch (error) {
    HanderResponse(error);
  }
};
