import { AxiosResponse } from "axios";
import api from "../library/axios";
import { API_ROUTE } from "../const/apiRoute";
import { NotificationExtension } from "../_base/extension/NotificationExtension";
import { Delay, HanderResponse } from "../_base/helper/FunctionHelper";
import { isNullOrUndefined } from "../_base/extension/StringExtension";
import apiUrl from "../library/axiosUrl";
import TokenService from "./login/token.service";
import { modals } from "@mantine/modals";

export const deleteSaleOrder = async (data: any): Promise<any> => {
  try {
    const response: AxiosResponse = await apiUrl.post(
      API_ROUTE.DELETE_SALE_ORDER,
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

export const modifySaleOrder = async (data: any): Promise<any> => {
  try {
    const response: AxiosResponse = await apiUrl.put(
      API_ROUTE.MODIFY_SALE_ORDER,
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

export const modifySaleOrderEditStatus = async (data: any): Promise<any> => {
  try {
    const response: AxiosResponse = await apiUrl.post(
      API_ROUTE.MODIFY_SALE_ORDER_EDIT_STATUS,
      data
    );
    if (!isNullOrUndefined(response) && response?.data?.success) {
      NotificationExtension.Success("Chỉnh sửa thành công !");
    } else if (response != null)
      NotificationExtension.Fails("Chỉnh sửa thất bại !");
    return response.data;
  } catch (error: any) {
    // HanderResponse(error);
    if (error.code === "ERR_NETWORK")
      NotificationExtension.Fails("Máy chủ không thể kết nối !");
    switch (error.response?.status) {
      case 401:
        NotificationExtension.Fails("Bạn không có quyền thực hiện thao tác !");

        await Delay(1000);

        modals.closeAll();
        break;
      case 404:
        NotificationExtension.Fails("Trang web không tồn tại");
        break;
      case 403:
        NotificationExtension.Fails(
          "Bạn không có quyền thực hiện chức năng này !"
        );
        modals.closeAll();
        break;
      case 500:
        NotificationExtension.Fails(
          error?.response?.data?.message ??
            "Có lỗi xảy ra ở máy chủ, xin vui lòng thử lại !"
        );
        modals.closeAll();
        break;
      default:
        break;
    }
  }
};

export const createSaleOrderStatus = async (data: any): Promise<any> => {
  try {
    const response: AxiosResponse = await api.post(
      API_ROUTE.CREATE_ORDER_STATUS,
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

export const deleteSaleOrderStatus = async (data: any): Promise<any> => {
  try {
    const response: AxiosResponse = await api.post(
      API_ROUTE.DELETE_ORDER_STATUS,
      data,
      {
        headers: { "Content-Type": "multipart/form-data" },
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

export const modifySaleOrderStatus = async (data: any): Promise<any> => {
  try {
    const response: AxiosResponse = await api.post(
      API_ROUTE.MODIFY_ORDER_STATUS,
      data,
      {
        headers: { "Content-Type": "multipart/form-data" },
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

export const modifySaleOrderAssign = async (data: any): Promise<any> => {
  try {
    const token = TokenService.getLocalAccessToken();
    const response: AxiosResponse = await apiUrl.post(
      API_ROUTE.MODIFY_ORDER_ASSIGN,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Thay thế "Bearer" nếu cần thiết
        },
      }
    );
    if (!isNullOrUndefined(response) && response?.data?.success) {
      NotificationExtension.Success("Sửa thành công !");
    } else if (response != null) NotificationExtension.Fails("Sửa thất bại !");

    return response.data;
  } catch (error: any) {
    // HanderResponse(error);
    if (error.code === "ERR_NETWORK")
      NotificationExtension.Fails("Máy chủ không thể kết nối !");
    switch (error.response?.status) {
      case 401:
        NotificationExtension.Fails("Bạn không có quyền thực hiện thao tác !");

        await Delay(1000);

        modals.closeAll();
        break;
      case 404:
        NotificationExtension.Fails("Trang web không tồn tại");
        break;
      case 403:
        NotificationExtension.Fails(
          "Bạn không có quyền thực hiện chức năng này !"
        );
        modals.closeAll();
        break;
      case 500:
        NotificationExtension.Fails(
          error?.response?.data?.message ??
            "Có lỗi xảy ra ở máy chủ, xin vui lòng thử lại !"
        );
        modals.closeAll();
        break;
      default:
        break;
    }
  }
};

export const forwardSaleOrderPOS = async (data: any): Promise<any> => {
  try {
    const response: AxiosResponse = await apiUrl.post(
      API_ROUTE.FORWARD_SALE_ORDER_POS,
      data
    );
    if (!isNullOrUndefined(response) && response?.data?.success) {
      NotificationExtension.Success("Gửi đơn thành công !");
    } else if (response != null)
      NotificationExtension.Fails("Gửi đơn thất bại !");
    return response.data;
  } catch (error) {
    HanderResponse(error);
  }
};
