import { AxiosResponse } from "axios";
import api from "../library/axios";
import { API_ROUTE } from "../const/apiRoute";
import { HanderResponse } from "../_base/helper/FunctionHelper";
import { NotificationExtension } from "../_base/extension/NotificationExtension";
import { isNullOrUndefined } from "../_base/extension/StringExtension";

export const getDataMegaMenu = async (query: any): Promise<any> => {
  try {
    const response: AxiosResponse = await api.get(
      API_ROUTE.GET_LIST_CATEGORY + query
    );
    return response.data;
  } catch (error) {
    HanderResponse(error);
  }
};

export const deleteItemCategory = async (data: any): Promise<any> => {
  try {
    const response: AxiosResponse = await api.post(
      API_ROUTE.DELETE_CATEGORY,
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

export const createItemCategory = async (data: any): Promise<any> => {
  try {
    const response: AxiosResponse = await api.post(
      API_ROUTE.CREATE_CATEGORY,
      data,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data;
  } catch (error) {
    HanderResponse(error);
  }
};

export const createItemCategoryGet = async (query: any): Promise<any> => {
  try {
    const response: AxiosResponse = await api.get(API_ROUTE.CREATE_CATEGORY);
    return response.data;
  } catch (error) {
    HanderResponse(error);
  }
};

export const modifyMegaMenuGet = async (query: any): Promise<any> => {
  try {
    const response: AxiosResponse = await api.get(
      API_ROUTE.MODIFY_CATEGORY + query
    );
    return response.data;
  } catch (error) {
    HanderResponse(error);
  }
};

export const modifyMegaMenuPost = async (data: any): Promise<any> => {
  try {
    const response: AxiosResponse = await api.post(
      API_ROUTE.MODIFY_CATEGORY,
      data,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data;
  } catch (error) {
    HanderResponse(error);
  }
};

export const EditPriority = async (query: any): Promise<any> => {
  try {
    const response: AxiosResponse = await api.post(
      API_ROUTE.EditPriority + query
    );
    return response.data;
  } catch (error) {
    HanderResponse(error);
  }
};

export const EditStatus = async (query: any): Promise<any> => {
  try {
    const response: AxiosResponse = await api.post(API_ROUTE.status + query);
    return response.data;
  } catch (error) {
    HanderResponse(error);
  }
};

export const EditOrderNumber = async (query: any): Promise<any> => {
  try {
    const response: AxiosResponse = await api.post(
      API_ROUTE.ordernumber + query
    );
    return response.data;
  } catch (error) {
    HanderResponse(error);
  }
};

export const EditStatusAttr = async (query: any): Promise<any> => {
  try {
    const response: AxiosResponse = await api.post(
      API_ROUTE.status_attr + query
    );
    return response.data;
  } catch (error) {
    HanderResponse(error);
  }
};

export const EditOrderNumberAttr = async (query: any): Promise<any> => {
  try {
    const response: AxiosResponse = await api.post(
      API_ROUTE.ordernumber_attr + query
    );
    return response.data;
  } catch (error) {
    HanderResponse(error);
  }
};

export const getListCategoryAttr = async (query: any): Promise<any> => {
  try {
    const response: AxiosResponse = await api.get(
      API_ROUTE.category_attr_list + query
    );
    return response.data;
  } catch (error) {
    HanderResponse(error);
  }
};

export const EditCategoryAttr = async (data: any): Promise<any> => {
  try {
    const response: AxiosResponse = await api.post(
      API_ROUTE.category_attr_edit,
      data
    );
    return response.data;
  } catch (error) {
    HanderResponse(error);
  }
};
