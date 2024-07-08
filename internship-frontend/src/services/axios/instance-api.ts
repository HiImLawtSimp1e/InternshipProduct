import axios from "axios";
import { cookies } from "next/headers";

const cookieStore = cookies();
const token = cookieStore.get("authToken")?.value || "";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

api.interceptors.request.use(
  (config) => {
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
