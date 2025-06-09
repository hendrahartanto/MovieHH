import { paths } from "@/config/paths";
import Axios, { InternalAxiosRequestConfig } from "axios";
import { getAccessToken, setAccessToken } from "./token-store";

export const api = Axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL,
});

const authRequestInterceptor = (config: InternalAxiosRequestConfig) => {
  const token = getAccessToken();

  if (config.headers) config.headers.Accept = "application/json"; //TODO: cari tau maksud ini
  if (token) config.headers.Authorization = `Bearer ${token}`;

  config.withCredentials = true;
  return config;
};

const refreshTokenIfNeeded = async (error: any) => {
  const originalRequest = error.config;

  if (error.response?.status === 401 && !originalRequest._retry) {
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((token) => {
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const res = await api.get("/auth/refresh");
      const newAccessToken = res.data.token;
      setAccessToken(newAccessToken);
      processQueue(null, newAccessToken);
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return api(originalRequest);
    } catch (error) {
      processQueue(error, null);
      //TODO: bisa logout user disini misalya gagal refresh
      return Promise.reject(error);
    } finally {
      isRefreshing = false;
    }
  } else if (error.response?.status === 401 && originalRequest._retry) {
    const redirectTo = window.location.pathname;
    window.location.href = paths.auth.login.getHref(redirectTo);
  }

  return Promise.reject(error);
};

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });

  failedQueue = [];
};

api.interceptors.request.use(authRequestInterceptor);
api.interceptors.response.use(
  (response) => response.data,
  refreshTokenIfNeeded
);
