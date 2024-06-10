import { AxiosResponse } from "axios";
import { NotificationExtension } from "../_base/extension/NotificationExtension";
import { HanderResponse, formatFormData } from "../_base/helper/FunctionHelper";
import { API_ROUTE } from "../const/apiRoute";
import api from "../library/axios";
import { isNullOrUndefined } from "../_base/extension/StringExtension";
import { featureOption } from "../model/ProductList";

export const getDataListProduct = async (query: string): Promise<any> => {
  try {
    const response: AxiosResponse = await api.get(
      API_ROUTE.GET_LIST_PRODUCT + query
    );
    return response.data;
  } catch (error) {
    HanderResponse(error);
  }
};

export const getDataDetailProduct = async (query: string): Promise<any> => {
  try {
    const response: AxiosResponse = await api.get(
      API_ROUTE.GET_DETAIL_PRODUCT + query
    );
    return response.data;
  } catch (error) {
    HanderResponse(error);
  }
};

export const modifyItemFeature = async (data: featureOption): Promise<any> => {
  try {
    const response: AxiosResponse = await api.post(
      API_ROUTE.MODIFY_FEATURE,
      data
    );
    if (!isNullOrUndefined(response) && response?.data?.success) {
      NotificationExtension.Success("Cập nhật thành công !");
      //updateSearchItemProduct();
    } else if (response != null)
      NotificationExtension.Fails("Cập nhật thất bại !");
    return response.data;
  } catch (error) {
    HanderResponse(error);
  }
};

export const createItemProduct = async (data: any): Promise<any> => {
  try {
    const formData = new FormData();
    // Thêm dữ liệu từ dataItemCommand vào FormData
    Object.keys(data).forEach((key) => {
      if (key === "tblItemImageCommands") {
        // Xử lý tblItemImageCommands dưới dạng FormData
        const tblItemImageCommands = data[key];
        tblItemImageCommands.forEach((item: any, index: number) => {
          Object.keys(item).forEach((itemKey) => {
            const formDataKey = `tblItemImageCommands[${index}].${itemKey}`;
            if (item[itemKey]) {
              formData.append(formDataKey, item[itemKey]);
            }
          });
        });
      } else if (key === "tagItemIds") {
        const tagItemIds = data[key];
        tagItemIds.forEach((item: any, index: number) => {
          const formDataKey = `tagItemIds[${index}]`;
          if (item !== null && item !== undefined) {
            if (item instanceof Object && !(item instanceof File)) {
              formData.append(formDataKey, item.tagId);
            } else formData.append(formDataKey, item);
          }
        });
      } else if (Array.isArray(data[key])) {
        // Handle arrays
        data[key].forEach((item: any, index: any) => {
          formatFormData(item, formData, `${key}[${index}]`);
        });
      } else if (data[key] instanceof Object && !(data[key] instanceof File)) {
        // If the value is an object (but not a File), recursively flatten it
        formatFormData(data[key], formData, key);
      } else {
        if (data[key] !== null && data[key] !== undefined) {
          formData.append(key, data[key]);
        }
      }
    });
    const response: AxiosResponse = await api.post(
      API_ROUTE.CREATE_PRODUCT,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    if (!isNullOrUndefined(response) && response?.data?.success) {
      NotificationExtension.Success("Thêm sản phẩm mới thành công !");
      //updateSearchItemProduct();
    } else if (response != null)
      NotificationExtension.Fails("Thêm sản phẩm mới thất bại !");
    return response.data;
  } catch (error) {
    HanderResponse(error);
  }
};

export const deleteItemProduct = async (data: any): Promise<any> => {
  try {
    const response: AxiosResponse = await api.post(
      API_ROUTE.DELETE_PRODUCT,
      data
    );
    if (!isNullOrUndefined(response) && response?.data?.success) {
      NotificationExtension.Success("Xóa thành công !");
      //updateSearchItemProduct();
    } else if (response != null) NotificationExtension.Fails("Xóa thất bại !");
    return response.data;
  } catch (error) {
    HanderResponse(error);
  }
};

export const modifyItemProduct = async (data: any): Promise<any> => {
  try {
    const formData = new FormData();

    // Thêm dữ liệu từ dataItemCommand vào FormData
    Object.keys(data).forEach((key) => {
      if (key === "tblItemImageCommands") {
        // Xử lý tblItemImageCommands dưới dạng FormData
        const tblItemImageCommands = data[key];
        tblItemImageCommands.forEach((item: any, index: number) => {
          Object.keys(item).forEach((itemKey) => {
            const formDataKey = `tblItemImageCommands[${index}].${itemKey}`;
            if (itemKey === "image" && typeof item[itemKey] === "string") {
              return;
            }
            if (item[itemKey]) {
              formData.append(formDataKey, item[itemKey]);
            }
          });
        });
      } else if (key === "tagItemIds") {
        const tagItemIds = data[key];
        tagItemIds.forEach((item: any, index: number) => {
          const formDataKey = `tagItemIds[${index}]`;
          if (item !== null && item !== undefined) {
            if (item instanceof Object && !(item instanceof File)) {
              formData.append(formDataKey, item.tagId);
            } else formData.append(formDataKey, item);
          }
        });
      } else if (Array.isArray(data[key])) {
        // Handle arrays
        data[key].forEach((item: any, index: any) => {
          formatFormData(item, formData, `${key}[${index}]`);
        });
      } else if (data[key] instanceof Object && !(data[key] instanceof File)) {
        // If the value is an object (but not a File), recursively flatten it
        formatFormData(data[key], formData, key);
      } else {
        if (data[key] !== null && data[key] !== undefined) {
          formData.append(key, data[key]);
        }
      }
    });

    const response: AxiosResponse = await api.post(
      API_ROUTE.MODIFY_PRODUCT,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    if (!isNullOrUndefined(response) && response?.data?.success) {
      NotificationExtension.Success("Chỉnh sửa sản phẩm thành công !");
      //updateSearchItemProduct();
    } else if (response != null)
      NotificationExtension.Fails("Chỉnh sửa sản phẩm thất bại !");
    return response.data;
  } catch (error) {
    HanderResponse(error);
  }
};

export const modifyItemStatus = async (id: any): Promise<any> => {
  try {
    const response: AxiosResponse = await api.post(
      `${API_ROUTE.MODIFY_ITEM_IN_USE}${id}`
    );
    if (!isNullOrUndefined(response) && response?.data?.success) {
      NotificationExtension.Success("Cập nhật thành công !");
      //updateSearchItemProduct();
    } else if (response != null)
      NotificationExtension.Fails("Cập nhật thất bại !");
    return response.data;
  } catch (error) {
    HanderResponse(error);
  }
};

export const modifyItemOrder = async (data: any): Promise<any> => {
  try {
    const response: AxiosResponse = await api.post(
      API_ROUTE.MODIFY_ITEM_ORDER,
      data
    );
    if (!isNullOrUndefined(response) && response?.data?.success) {
      NotificationExtension.Success("Cập nhật thành công !");
      //updateSearchItemProduct();
    } else if (response != null)
      NotificationExtension.Fails("Cập nhật thất bại !");
    return response.data;
  } catch (error) {
    HanderResponse(error);
  }
};

export const updateSearchItemProduct = async () => {
  api.get(API_ROUTE.REMOVE_BY_INDEX_NAME);
  api.get(API_ROUTE.SYNC_ITEM);
};

export const getListTechnicalCommon = async (query: string): Promise<any> => {
  try {
    const response: AxiosResponse = await api.get(
      API_ROUTE.GET_LIST_TECHNICAL_COMMON + query
    );
    return response.data;
  } catch (error) {
    HanderResponse(error);
  }
};

export const createTechnicalCommon = async (data: any): Promise<any> => {
  try {
    const response: AxiosResponse = await api.post(
      API_ROUTE.CREATE_TECHNICAL_COMMON,
      data
    );
    return response.data;
  } catch (error) {
    HanderResponse(error);
  }
};

export const deleteTechnicalCommon = async (data: any): Promise<any> => {
  try {
    const response: AxiosResponse = await api.post(
      API_ROUTE.DELETE_TECHNICAL_COMMON,
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

export const modifyTechnicalCommon = async (data: any): Promise<any> => {
  try {
    const response: AxiosResponse = await api.put(
      API_ROUTE.MODIFY_TECHNICAL_COMMON,
      data
    );
    return response.data;
  } catch (error) {
    HanderResponse(error);
  }
};
