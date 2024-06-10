import { AxiosResponse } from "axios";
import api from "../library/axios";
import { API_ROUTE } from "../const/apiRoute";
import { isNullOrUndefined } from "../_base/extension/StringExtension";
import { NotificationExtension } from "../_base/extension/NotificationExtension";
import { HanderResponse } from "../_base/helper/FunctionHelper";

export const createConfigGroup = async (data: any): Promise<any> => {
  try {
    const response: AxiosResponse = await api.post(
      API_ROUTE.CREATE_CONFIG_GROUP,
      data
    );
    if (!isNullOrUndefined(response) && response?.data?.success) {
      NotificationExtension.Success("Tạo nhóm cấu hình sản phẩm thành công");
    } else if (response != null)
      NotificationExtension.Fails("Tạo nhóm cấu hình sản phẩm thất bại !");
    return response.data;
  } catch (error) {
    HanderResponse(error);
  }
};

export const editConfigGroup = async (data: any): Promise<any> => {
  try {
    const response: AxiosResponse = await api.post(
      API_ROUTE.EDIT_CONFIG_GROUP,
      data
    );
    if (!isNullOrUndefined(response) && response?.data?.success) {
      NotificationExtension.Success(
        "Chỉnh sửa nhóm cấu hình sản phẩm thành công"
      );
    } else if (response != null)
      NotificationExtension.Fails(
        "Chỉnh sửa nhóm cấu hình sản phẩm thất bại !"
      );
    return response.data;
  } catch (error) {
    HanderResponse(error);
  }
};

export const deleteConfigGroup = async (data: any): Promise<any> => {
  try {
    const response: AxiosResponse = await api.post(
      API_ROUTE.DELETE_CONFIG_GROUP,
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

export const createConfigGroupAttribute = async (data: any): Promise<any> => {
  try {
    const response: AxiosResponse = await api.post(
      API_ROUTE.CREATE_CONFIG_GROUP_ATTRIBUTE,
      data
    );
    if (!isNullOrUndefined(response) && response?.data?.success) {
      NotificationExtension.Success("Tạo thuộc tính thành công");
    } else if (response != null)
      NotificationExtension.Fails("Tạo thuộc tính thất bại !");
    return response.data;
  } catch (error) {
    HanderResponse(error);
  }
};

export const editConfigGroupAttribute = async (data: any): Promise<any> => {
  try {
    const response: AxiosResponse = await api.post(
      API_ROUTE.EDIT_CONFIG_GROUP_ATTRIBUTE,
      data
    );
    if (!isNullOrUndefined(response) && response?.data?.success) {
      NotificationExtension.Success("Cập nhật thuộc tính thành công");
    } else if (response != null)
      NotificationExtension.Fails("Cập nhật thuộc tính thất bại !");
    return response.data;
  } catch (error) {
    HanderResponse(error);
  }
};

export const deleteConfigGroupAttribute = async (data: any): Promise<any> => {
  try {
    const response: AxiosResponse = await api.post(
      API_ROUTE.DELETE_CONFIG_GROUP_ATTRIBUTE,
      data
    );
    if (!isNullOrUndefined(response) && response?.data?.success) {
      NotificationExtension.Success("Xóa thuộc tính thành công !");
    } else if (response != null)
      NotificationExtension.Fails("Xóa thuộc tính thất bại !");
    return response.data;
  } catch (error) {
    HanderResponse(error);
  }
};

export const createConfigGroupAttributeValue = async (
  data: any
): Promise<any> => {
  try {
    const response: AxiosResponse = await api.post(
      API_ROUTE.CREATE_CONFIG_GROUP_ATTRIBUTE_VALUE,
      data
    );
    if (!isNullOrUndefined(response) && response?.data?.success) {
      NotificationExtension.Success("Tạo giá trị thuộc tính thành công");
    } else if (response != null)
      NotificationExtension.Fails("Tạo giá trị thuộc tính thất bại !");
    return response.data;
  } catch (error) {
    HanderResponse(error);
  }
};

export const editConfigGroupAttributeValue = async (
  data: any
): Promise<any> => {
  try {
    const response: AxiosResponse = await api.post(
      API_ROUTE.EDIT_CONFIG_GROUP_ATTRIBUTE_VALUE,
      data
    );
    if (!isNullOrUndefined(response) && response?.data?.success) {
      NotificationExtension.Success("Cập nhật giá trị thuộc tính thành công");
    } else if (response != null)
      NotificationExtension.Fails("Cập nhật giá trị thuộc tính thất bại !");
    return response.data;
  } catch (error) {
    HanderResponse(error);
  }
};

export const deleteConfigGroupAttributeValue = async (
  data: any
): Promise<any> => {
  try {
    const response: AxiosResponse = await api.post(
      API_ROUTE.DELETE_CONFIG_GROUP_ATTRIBUTE_VALUE,
      data
    );
    if (!isNullOrUndefined(response) && response?.data?.success) {
      NotificationExtension.Success("Xóa giá trị thuộc tính thành công !");
    } else if (response != null)
      NotificationExtension.Fails("Xóa giá trị thuộc tính thất bại !");
    return response.data;
  } catch (error) {
    HanderResponse(error);
  }
};

export const createConfigGroupProduct = async (data: any): Promise<any> => {
  try {
    const response: AxiosResponse = await api.post(
      API_ROUTE.CREATE_CONFIG_GROUP_PRODUCT,
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

export const editConfigGroupProduct = async (data: any): Promise<any> => {
  try {
    const response: AxiosResponse = await api.post(
      API_ROUTE.EDIT_CONFIG_GROUP_PRODUCT,
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

export const deleteConfigGroupProduct = async (data: any): Promise<any> => {
  try {
    const response: AxiosResponse = await api.post(
      API_ROUTE.DELETE_CONFIG_GROUP_PRODUCT,
      data
    );
    if (!isNullOrUndefined(response) && response?.data?.success) {
      NotificationExtension.Success("Xóa sản phẩm trong nhóm thành công !");
    } else if (response != null)
      NotificationExtension.Fails("Xóa sản phẩm trong nhóm thất bại !");
    return response.data;
  } catch (error) {
    HanderResponse(error);
  }
};
