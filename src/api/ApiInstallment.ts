import { AxiosResponse } from "axios";
import { NotificationExtension } from "../_base/extension/NotificationExtension";
import { HanderResponse } from "../_base/helper/FunctionHelper";
import { isNullOrUndefined } from "../_base/extension/StringExtension";
import { API_ROUTE } from "../const/apiRoute";
import apiUrl from "../library/axiosUrl";

export const createInstallment = async (data: any): Promise<any> => {
  try {
    const response: AxiosResponse = await apiUrl.post(
      API_ROUTE.CREATE_INSTALLMENT,
      data
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

export const deleteInstallment = async (data: any): Promise<any> => {
  try {
    const response: AxiosResponse = await apiUrl.delete(
      `${API_ROUTE.DELETE_INSTALLMENT}?id=${data}`
    );
    if (!isNullOrUndefined(response) && response?.data?.success) {
      NotificationExtension.Success("Xóa thành công !");
    } else if (response != null) NotificationExtension.Fails("Xóa thất bại !");
    return response.data;
  } catch (error) {
    HanderResponse(error);
  }
};

export const modifyInstallment = async (data: any): Promise<any> => {
  try {
    const response: AxiosResponse = await apiUrl.post(
      API_ROUTE.MODIFY_INSTALLMENT,
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

export const modifyInstallmentOrderStatus = async (data: any): Promise<any> => {
  try {
    const response: AxiosResponse = await apiUrl.post(
      `${API_ROUTE.EDIT_INSTALLMENT_ORDER}`,
      data
    );
    return response.data;
  } catch (error) {
    HanderResponse(error);
  }
};
