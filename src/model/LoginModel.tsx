export interface LoginModel {
  username: string;
  password: string;
  remember: boolean;
}
export interface Register {
  username: string;
  password: string;
  confirmPassword: string;
}

export interface Refresh {
  userName: string;
  refreshToken: string;
  id: string;
}

export interface dataRecover {
  userName: string;
  code: string; //add to api
}

export interface PasswordRecovery {
  username: string;
}