import axios, { AxiosResponse, AxiosError } from "axios";
import { BASE_API_URL } from "../config";
import AuthService from "../api/login/auth.service";

const api = axios.create({
  baseURL: BASE_API_URL,
  headers: {
    "Content-Type": "application/json;charset=utf-8",
    "Access-Control-Allow-Origin": "*",
  },
});

api.interceptors.request.use(async (request) => {
  const token = localStorage.getItem("token");
  if (token) {
    request.headers.Authorization = `Bearer ${token.replace(/^"|"$/g, "")}`;
  }
  return request;
});

api.interceptors.response.use(
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

export default api;
