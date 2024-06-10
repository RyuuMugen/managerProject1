import { AxiosResponse } from "axios";
import { API_ROUTE } from "../const/apiRoute";
import { HanderResponse } from "../_base/helper/FunctionHelper";
import { NotificationExtension } from "../_base/extension/NotificationExtension";
import api from "../library/axios";
import { isNullOrUndefined } from "../_base/extension/StringExtension";

export const getDataUserComment = async (): Promise<any> => {
  try {
    const response: AxiosResponse = await api.get(
      `${API_ROUTE.GET_LIST_USER_COMMENT}`
    );
    return response.data;
  } catch (error) {
    HanderResponse(error);
  }
};

export const createUserComment = async (data: any): Promise<any> => {
  try {
    const response: AxiosResponse = await api.post(
      API_ROUTE.CREATE_USER_COMMENT,
      data
    );
    if (!isNullOrUndefined(response) && response?.data?.success) {
      NotificationExtension.Success("Gửi bình luận thành công");
    } else if (response != null)
      NotificationExtension.Fails("Gửi bình luận thất bại !");
    return response.data;
  } catch (error) {
    HanderResponse(error);
  }
};

export const modifyUserComment = async (data: any): Promise<any> => {
  try {
    const response: AxiosResponse = await api.post(
      API_ROUTE.MODIFY_USER_COMMENT,
      data
    );
    if (!isNullOrUndefined(response) && response?.data?.success) {
      NotificationExtension.Success("Chỉnh sửa bình luận thành công");
    } else if (response != null)
      NotificationExtension.Fails("Chỉnh sửa bình luận thất bại !");
    return response.data;
  } catch (error) {
    HanderResponse(error);
  }
};

export const deleteUserComment = async (data: any): Promise<any> => {
  try {
    const response: AxiosResponse = await api.post(
      API_ROUTE.DELETE_USER_COMMENT,
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

export const modifyDisableUserComment = async (id: number): Promise<any> => {
  try {
    const response: AxiosResponse = await api.post(
      `${API_ROUTE.MODIFY_DISABLE_USER_COMMENT}${id}`
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

export const createUserCommentReply = async (data: any): Promise<any> => {
  try {
    const response: AxiosResponse = await api.post(
      API_ROUTE.CREATE_USER_COMMENT_REPLY,
      data
    );
    if (!isNullOrUndefined(response) && response?.data?.success) {
      NotificationExtension.Success("Gửi trả lời bình luận thành công");
    } else if (response != null)
      NotificationExtension.Fails("Gửi trả lời bình luận thất bại !");
    return response.data;
  } catch (error) {
    HanderResponse(error);
  }
};

export const deleteUserCommentReply = async (data: any): Promise<any> => {
  try {
    const response: AxiosResponse = await api.post(
      API_ROUTE.DELETE_USER_COMMENT_REPLY,
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

export const modifyDisableUserCommentReply = async (
  id: number
): Promise<any> => {
  try {
    const response: AxiosResponse = await api.post(
      `${API_ROUTE.MODIFY_DISABLE_USER_COMMENT_REPLY}${id}`
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
