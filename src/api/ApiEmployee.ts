import { AxiosResponse } from "axios";
import { HanderResponse } from "../_base/helper/FunctionHelper";
import { API_ROUTE } from "../const/apiRoute";
import api from "../library/axios";

export const getDataEmployeekdol = async (query: string): Promise<any> => {
  try {
    const response: AxiosResponse = await api.get(
      `${API_ROUTE.GET_LIST_EMPLOYEE_KDOL}?${query}`
    );
    return response.data;
  } catch (error) {
    HanderResponse(error);
  }
};
