import { AxiosResponse } from "axios";
import { API_ROUTE } from "../const/apiRoute";
import { NotificationExtension } from "../_base/extension/NotificationExtension";
import { HanderResponse } from "../_base/helper/FunctionHelper";
import { isNullOrUndefined } from "../_base/extension/StringExtension";
import api from "../library/axios";

export const createCoupon = async (data: any): Promise<any> => {
  try {
    const response: AxiosResponse = await api.post(
      API_ROUTE.CREATE_COUPON,
      data
    );
    console.log(response);
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

export const editCoupon = async (data: any): Promise<any> => {
  try {
    const response: AxiosResponse = await api.put(
      API_ROUTE.MODIFY_COUPON,
      data
    );
    if (!isNullOrUndefined(response) && response?.data?.success) {
      NotificationExtension.Success("Sửa thành công !");
    } else if (response != null) NotificationExtension.Fails("Sửa thất bại !");
    return response.data;
  } catch (error) {
    HanderResponse(error);
  }
};

export const deleteCoupon = async (data: any): Promise<any> => {
  try {
    const response: AxiosResponse = await api.post(
      API_ROUTE.DELETE_COUPON,
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
