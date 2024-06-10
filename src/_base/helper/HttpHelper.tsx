import axios, {
  AxiosInstance,
  AxiosResponse,
  AxiosRequestConfig,
  AxiosError,
} from "axios";

import { start } from "repl";
import { json, useNavigate } from "react-router-dom";
import { isNullOrEmpty } from "../extension/StringExtension";
import { Delay } from "./FunctionHelper";
import { NotificationExtension } from "../extension/NotificationExtension";
import { modals } from "@mantine/modals";
import AuthService from "../../api/login/auth.service";

class Repository {
  private axiosInstance: AxiosInstance;
  constructor(baseURL?: string) {
    if (isNullOrEmpty(baseURL)) throw Error("Lỗi base url env !");
    this.axiosInstance = axios.create({
      baseURL,
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        "Access-Control-Allow-Origin": "*",
      },
    });
    this.axiosInstance.interceptors.request.use(async (request) => {
      const token = localStorage.getItem("token");
      if (token) {
        request.headers.Authorization = `Bearer ${token.replace(/^"|"$/g, "")}`;
      }
      return request;
    });

    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        // Xử lý lỗi mạng hoặc lỗi từ server ở đây
        console.error("API request failed:", error);

        if (error?.response?.status == 401) {
          //loi 401 thi call lại api refresh tại đây
          const originalRequest = error?.config;
          if (error?.response?.status == 401 && localStorage.getItem("token")) {
            const userName = localStorage.getItem("userName") || "{}";
            const refreshToken = localStorage.getItem("refreshToken") || "{}";
            const id = localStorage.getItem("id") || "{}";
            const dataRefresh = await AuthService.refreshToken({
              userName: userName,
              refreshToken: refreshToken,
              id: id,
            });
            console.log("dataRefresh", dataRefresh);
            originalRequest.headers.Authorization = `Bearer ${dataRefresh?.data?.jwt}`;
            return axios(originalRequest);
          }
        }
        return Promise.reject(error);
      }
    );
  }

  public async get<T = any>(url: string, config?: AxiosRequestConfig) {
    await Delay(100);
    try {
      var res = await this.axiosInstance.get<T>(url, config);
      return res.data;
    } catch (error: any) {
      await this.HanderResponse(error);
      return null;
    }
  }

  public async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ) {
    await Delay(100);
    try {
      var res = await this.axiosInstance.post<T>(url, data, config);
      return res.data;
    } catch (error: any) {
      await this.HanderResponse(error);
      return null;
    }
  }

  public async put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ) {
    await Delay(1000);
    try {
      var res = await this.axiosInstance.put<T>(url, data, config);
      return res.data;
    } catch (error: any) {
      await this.HanderResponse(error);
      return null;
    }
  }

  private async HanderResponse(res: any) {
    const currentURL = window.location.pathname;
    if (res.code === "ERR_NETWORK")
      NotificationExtension.Fails("Máy chủ không thể kết nối !");
    switch (res.response?.status) {
      case 401:
        NotificationExtension.Fails("Xin vui lòng đăng nhập lại !");

        await Delay(1000);

        modals.closeAll();
        break;
      case 404:
        NotificationExtension.Fails(
          res?.response?.data?.message ?? "Trang web không tồn tại !"
        );
        //  modals.closeAll();
        break;
      // throw new Response("Trang web không tồn tại !", {
      //   status: res.response?.status,
      // });
      case 403:
        NotificationExtension.Fails(
          "Bạn không có quyền thực hiện chức năng này !"
        );
        modals.closeAll();
        break;
      case 415:
        NotificationExtension.Fails("Dữ liệu không phù hợp !");
        //  modals.closeAll();
        break;
      case 500:
        NotificationExtension.Fails(
          res?.response?.data?.message ??
            "Có lỗi xảy ra ở máy chủ, xin vui lòng thử lại !"
        );
        //  modals.closeAll();
        break;
      default:
        break;
    }
  }
}

export default Repository;
