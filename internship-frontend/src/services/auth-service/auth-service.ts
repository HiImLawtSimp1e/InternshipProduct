import Cookies from "js-cookie";

export const setAuthPublic = (token: string) => {
  Cookies.set("authToken", token);
};
