import { AxiosResponse } from "axios";
import { NotificationExtension } from "../_base/extension/NotificationExtension";
import { HanderResponse, formatFormData } from "../_base/helper/FunctionHelper";
import { API_ROUTE } from "../const/apiRoute";
import api from "../library/axios";
import { isNullOrUndefined } from "../_base/extension/StringExtension";

export const getDataConfigWeb = async (): Promise<any> => {
  try {
    const response: AxiosResponse = await api.post(
      `${API_ROUTE.GET_CONFIG_WEB}`
    );
    return response.data;
  } catch (error) {
    HanderResponse(error);
  }
};

export const modifyConfigWeb = async (data: any): Promise<any> => {
  try {
    const formData = new FormData();

    Object.keys(data).forEach((key) => {
      if (key === "banner") {
        const Banner = data[key];
        if (Banner) {
          Object.keys(Banner).forEach((itemKey) => {
            if (Banner.hasOwnProperty(itemKey)) {
              if (itemKey === "creationDate" || itemKey === "lastUpdateDate") {
                return;
              }

              if (Array.isArray(Banner[itemKey])) {
                Banner[itemKey].forEach((item: any, index: any) => {
                  formatFormData(item, formData, `banner.${itemKey}[${index}]`);
                });
              } else {
                const formDataKey = `banner.${itemKey}`;
                if (formDataKey) {
                  formData.append(formDataKey, Banner[itemKey]);
                }
              }
            }
          });
        }
      } else if (Array.isArray(data[key])) {
        // Handle arrays
        data[key].forEach((item: any, index: any) => {
          formatFormData(item, formData, `${key}[${index}]`);
        });
      } else if (data[key] instanceof Object && !(data[key] instanceof File)) {
        // If the value is an object (but not a File), recursively flatten it
        formatFormData(data[key], formData, key);
      } else {
        if (data[key]) {
          formData.append(key, data[key]);
        }
      }
    });

    const response: AxiosResponse = await api.post(
      API_ROUTE.MODIFY_CONFIG_WEB,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
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
