import axios from "axios";
import { refresh as refreshApi } from "../api/authApi";
const API_URL = import.meta.env.VITE_API_URL;
const axiosClient = axios.create({
  baseURL: API_URL + "api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    const isRefreshRequest = originalRequest.url?.includes("/user/refresh");

    if (error.response?.status === 401 && !originalRequest._retry && !isRefreshRequest) {
      originalRequest._retry = true;

      try {
        const res = await refreshApi();
        localStorage.setItem("accessToken", res.accessToken);

        originalRequest.headers.Authorization = `Bearer ${res.accessToken}`;
        return axiosClient(originalRequest);
      } catch (err) {
        window.dispatchEvent(new Event("auth:logout"));
        return Promise.reject(err);
      }
    }
    if (error.response?.status === 403) {
      window.dispatchEvent(new Event("error:403: You don't have permission to access this resource"));
      window.location.href = "/";
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);



export default axiosClient;
