import axios, { AxiosResponse, AxiosError } from "axios";
import { BASE_API_URL2 } from "../config";
import TokenService from "../api/login/token.service";

const apiUrl = axios.create({
  baseURL: BASE_API_URL2,
  headers: {
    "Content-Type": "application/json;charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    Authorization: `Bearer ${TokenService.getLocalAccessToken()}`,
  },
});

apiUrl.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    // Xử lý lỗi mạng hoặc lỗi từ server ở đây
    console.error("API request failed:", error);
    return Promise.reject(error);
  }
);

export default apiUrl;
