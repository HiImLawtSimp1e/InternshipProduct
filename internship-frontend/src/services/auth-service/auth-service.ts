import Cookies from "js-cookie";

export const setAuthPublic = (token: string) => {
  Cookies.set("authToken", token);
};

export const getAuthPublic = () => {
  const authToken = Cookies.get("authToken");
  if (authToken) {
    return authToken;
  }
  return null;
};

export const setLogoutPublic = () => {
  Cookies.remove("authToken");
};
