const getLocalRefreshToken = (): string | null => {
  return JSON.parse(localStorage.getItem("refreshToken") || "{}");
};

const getLocalAccessToken = (): string | null => {
  return JSON.parse(localStorage.getItem("token") || "{}");
};

const updateLocalAccessToken = (token: string): void => {
  let user = JSON.parse(localStorage.getItem("user") || "{}");
  user.token = token;
  localStorage.setItem("user", JSON.stringify(user));
};

const getUser = (): any => {
  return JSON.parse(localStorage.getItem("user") || "{}");
};

const setUser = (user: any): void => {
  localStorage.setItem("id", JSON.stringify(user?.id));
  localStorage.setItem("token", JSON.stringify(user?.jwt));
  localStorage.setItem("refreshToken", JSON.stringify(user?.refreshToken));
};

const removeUser = (): void => {
  localStorage.removeItem("id");
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
};

const TokenService = {
  getLocalRefreshToken,
  getLocalAccessToken,
  updateLocalAccessToken,
  getUser,
  setUser,
  removeUser,
};

export default TokenService;
