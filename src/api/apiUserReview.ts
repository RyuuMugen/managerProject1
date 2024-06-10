import { AxiosResponse } from "axios";
import api from "../library/axios";
import { API_ROUTE } from "../const/apiRoute";
import { NotificationExtension } from "../_base/extension/NotificationExtension";
import { isNullOrUndefined } from "../_base/extension/StringExtension";
import { HanderResponse } from "../_base/helper/FunctionHelper";

export const createUserReview = async (data: any): Promise<any> => {
  try {
    const response: AxiosResponse = await api.post(
      API_ROUTE.CREATE_USER_REVIEW,
      data
    );
    if (!isNullOrUndefined(response) && response?.data?.success) {
      NotificationExtension.Success("Gửi đánh giá thành công");
    } else if (response != null)
      NotificationExtension.Fails("Gửi đánh giá thất bại !");
    return response.data;
  } catch (error) {
    HanderResponse(error);
  }
};

export const getDataUserReview = async (): Promise<any> => {
  try {
    const response: AxiosResponse = await api.get(
      `${API_ROUTE.GET_LIST_USER_REVIEW}`
    );
    return response.data;
  } catch (error) {
    HanderResponse(error);
  }
};

export const getDataUserReviewDetail = async (id: any): Promise<any> => {
  try {
    const response: AxiosResponse = await api.get(
      `${API_ROUTE.GET_USER_REVIEW_DETAIL}${id}`
    );
    return response.data;
  } catch (error) {
    HanderResponse(error);
  }
};

export const modifyUserReview = async (data: any): Promise<any> => {
  try {
    const response: AxiosResponse = await api.post(
      API_ROUTE.MODIFY_USER_REVIEW,
      data
    );
    if (!isNullOrUndefined(response) && response?.data?.success) {
      NotificationExtension.Success("Chỉnh sửa đánh giá thành công");
    } else if (response != null)
      NotificationExtension.Fails("Chỉnh sửa đánh giá thất bại !");
    return response.data;
  } catch (error) {
    HanderResponse(error);
  }
};

export const deleteUserReview = async (data: any): Promise<any> => {
  try {
    const response: AxiosResponse = await api.post(
      API_ROUTE.DELETE_USER_REVIEW,
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

export const modifyDisableUserReview = async (id: number): Promise<any> => {
  try {
    const response: AxiosResponse = await api.post(
      `${API_ROUTE.MODIFY_DISABLE_USER_REVIEW}${id}`
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
