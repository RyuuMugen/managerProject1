import api from "./api";
import TokenService from "./token.service";
import { LoginModel, Register, Refresh, dataRecover, PasswordRecovery } from "../../model/LoginModel";
import { NotificationExtension } from "../../_base/extension/NotificationExtension";
import { HanderResponse } from "../../_base/helper/FunctionHelper";
import { isNullOrUndefined } from "../../_base/extension/StringExtension";

const register = (dataRegister: Register): Promise<any> => {
  return api
    .post("/Auth/register", dataRegister)
    .then((response) => {
      if (!isNullOrUndefined(response) && response?.data?.success) {
        NotificationExtension.Success("Bạn đã đăng ký thành công");
        return response.data;
      } else if (response != null)
        NotificationExtension.Fails("Đăng ký thất bại !");
    })
    .catch((error) => {
      // Xử lý lỗi ở đây
      HanderResponse(error);
    });
};

const login = (dataLogin: LoginModel): Promise<any> => {
  return api
    .post("/Auth/login", dataLogin)
    .then((response) => {
      if (!isNullOrUndefined(response) && response?.data?.success) {
        if (response.data?.data?.jwt) {
          TokenService.setUser(response?.data?.data);
        }
        NotificationExtension.Success("Bạn đã đăng nhập thành công");
        return response.data;
      } else if (response != null)
        NotificationExtension.Fails("Đăng nhập thất bại !");
    })
    .catch((error) => {
      // Xử lý lỗi ở đây
      HanderResponse(error);
    });
};

const logout = (): void => {
  TokenService.removeUser();
};

const getCurrentUser = (): any => {
  const userString = localStorage.getItem("user");
  return userString ? JSON.parse(userString) : null;
};

const refreshToken = (dataRefresh: Refresh): Promise<any> => {
  return api
    .post("/Auth/refresh", dataRefresh)
    .then((response) => {
      if (!isNullOrUndefined(response) && response?.data?.success) {
        if (response.data?.data?.jwt) {
          TokenService.setUser(response?.data?.data);
        }
        NotificationExtension.Success("Đăng nhập thành công");
        return response.data;
      } else {
        NotificationExtension.Fails(
          "Phiên đăng nhập đã hết hạn vui lòng đăng nhập lại"
        );
        return null;
      }
    })
    .catch((error) => {
      // Xử lý lỗi ở đây
      HanderResponse(error);
    });
};

const recoveryPass = (dataRecover: dataRecover): Promise<any> => {
  return api
    .post("/Auth/recover-pass", dataRecover)
    .then((response) => {
      if (response.data.success)
        NotificationExtension.Success("Xác nhận thành công");
      else NotificationExtension.Fails("Xác nhận thất bại");
      return response.data;
    })
    .catch((error) => {
      HanderResponse(error);
    });
};

const PassRecovery = (dataLogin: PasswordRecovery): Promise<any> => {
  return api
    .get(`/Auth/code-recover-pass?UserName=${dataLogin.username}`)
    .then((response) => {
      // if (response.data?.data?.jwt) {
      //   TokenService.setUser(response?.data?.data);
      // }
      if (response.data.success)
        NotificationExtension.Success("Gửi mã khôi phục thành công");
      else NotificationExtension.Fails("Gửi mã khôi phục thất bại");
      return response.data;
    })
    .catch((error) => {
      HanderResponse(error);
    });
};




const AuthService = {
  register,
  login,
  logout,
  getCurrentUser,
  refreshToken,
  recoveryPass,
  PassRecovery,
};

export default AuthService;
