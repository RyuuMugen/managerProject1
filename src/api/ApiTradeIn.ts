import { AxiosResponse } from "axios";
import api from "../library/axios";
import { API_ROUTE } from "../const/apiRoute";
import { isNullOrUndefined } from "../_base/extension/StringExtension";
import { NotificationExtension } from "../_base/extension/NotificationExtension";
import { HanderResponse } from "../_base/helper/FunctionHelper";
import { TblTradeInProductEdit } from "../model/TblTradeIn";

export const createTradeInOrder = async (data: any): Promise<any> => {
  try {
    const response: AxiosResponse = await api.post(
      API_ROUTE.CREATE_TRADE_IN_ORDER,
      data
    );
    if (!isNullOrUndefined(response) && response?.data?.success) {
      NotificationExtension.Success("Gửi đơn thu cũ - đổi mới thành công");
    } else if (response != null)
      NotificationExtension.Fails("Gửi đơn thu cũ - đổi mới thất bại !");
    return response.data;
  } catch (error) {
    HanderResponse(error);
  }
};

export const modifyTradeInOrder = async (data: any): Promise<any> => {
  try {
    const response: AxiosResponse = await api.put(
      API_ROUTE.MODIFY_TRADE_IN_ORDER,
      data
    );
    if (!isNullOrUndefined(response) && response?.data?.success) {
      NotificationExtension.Success(
        "Chỉnh sửa đơn thu cũ - đổi mới thành công"
      );
    } else if (response != null)
      NotificationExtension.Fails("Chỉnh sửa đơn thu cũ - đổi mới thất bại !");
    return response.data;
  } catch (error) {
    HanderResponse(error);
  }
};

export const getListTradeInHeader = async (data: any): Promise<any> => {
  try {
    const response: AxiosResponse = await api.post(
      API_ROUTE.GET_LIST_TRADE_IN_HEADER + data
    );
    return response.data;
  } catch (error) {
    HanderResponse(error);
  }
};

export const modifyTradeInHeader = async (data: any): Promise<any> => {
  try {
    const response: AxiosResponse = await api.post(
      API_ROUTE.MODIFY_TRADE_IN_HEADER,
      data
    );
    if (!isNullOrUndefined(response) && response?.data?.success) {
      NotificationExtension.Success("Chỉnh sửa danh mục thành công");
    } else if (response != null)
      NotificationExtension.Fails("Chỉnh sửa danh mục thất bại !");
    return response.data;
  } catch (error) {
    HanderResponse(error);
  }
};

export const createTradeInProduct = async (
  data: TblTradeInProductEdit
): Promise<any> => {
  try {
    const response: AxiosResponse = await api.post(
      API_ROUTE.CREATE_TRADE_IN_PRODUCT,
      data
    );
    if (!isNullOrUndefined(response) && response?.data?.success) {
      NotificationExtension.Success("Thêm sản phẩm vào nhóm thành công");
    } else if (response != null)
      NotificationExtension.Fails("Thêm sản phẩm vào nhóm thất bại !");
    return response.data;
  } catch (error) {
    HanderResponse(error);
  }
};

export const modifyTradeInProduct = async (
  data: TblTradeInProductEdit
): Promise<any> => {
  try {
    const response: AxiosResponse = await api.put(
      API_ROUTE.MODIFY_TRADE_IN_PRODUCT,
      data
    );
    if (!isNullOrUndefined(response) && response?.data?.success) {
      NotificationExtension.Success("Chỉnh sửa sản phẩm trong nhóm thành công");
    } else if (response != null)
      NotificationExtension.Fails("Chỉnh sửa sản phẩm trong nhóm thất bại !");
    return response.data;
  } catch (error) {
    HanderResponse(error);
  }
};

export const deleteTradeInProduct = async (data: any): Promise<any> => {
  try {
    const response: AxiosResponse = await api.post(
      API_ROUTE.DELETES_TRADE_IN_PRODUCT,
      data
    );
    if (!isNullOrUndefined(response) && response?.data?.success) {
      NotificationExtension.Success("Xoá sản phẩm trong nhóm thành công");
    } else if (response != null)
      NotificationExtension.Fails("Xoá sản phẩm trong nhóm thất bại !");
    return response.data;
  } catch (error) {
    HanderResponse(error);
  }
};


export const modifyTradeInProductActive = async (data: any): Promise<any> => {
  try {
    const response: AxiosResponse = await api.post(
      API_ROUTE.MODIFY_TRADE_IN_PRODUCT_ACTIVE,
      data
    );
    if (!isNullOrUndefined(response) && response?.data?.success) {
      NotificationExtension.Success("Cập nhật thành công !");
    } else if (response != null)
      NotificationExtension.Fails("Cập nhật thất bại !");
    return response.data;
  } catch (error) {
    HanderResponse(error);
  }
};
