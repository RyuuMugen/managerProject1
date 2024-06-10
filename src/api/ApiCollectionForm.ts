import { AxiosResponse } from "axios";
import apiUrl from "../library/axiosUrl";
import { API_ROUTE } from "../const/apiRoute";
import { isNullOrUndefined } from "../_base/extension/StringExtension";
import { NotificationExtension } from "../_base/extension/NotificationExtension";
import { HanderResponse } from "../_base/helper/FunctionHelper";

export const deleteCollectionForm = async (data: any): Promise<any> => {
  try {
    const response: AxiosResponse = await apiUrl.post(
      API_ROUTE.DELETE_COLLECTION_FORM,
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
