import Axios, { InternalAxiosRequestConfig } from "axios";
import { getAccessToken, setAccessToken } from "./token-store";
import { paths } from "@/config/paths";

export const api = Axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL,
});

export const rawApi = Axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL,
});

const authRequestInterceptor = (config: InternalAxiosRequestConfig) => {
  const token = getAccessToken();

  if (config.headers) config.headers.Accept = "application/json"; //TODO: cari tau maksud ini
  if (token) config.headers.Authorization = `Bearer ${token}`;

  config.withCredentials = true;
  return config;
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
      const res = await rawApi.get("/auth/refresh", { withCredentials: true });
      const newAccessToken = res.data.data.token;
      setAccessToken(newAccessToken);
      processQueue(null, newAccessToken);
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return api(originalRequest);
    } catch (error) {
      processQueue(error, null);

      const currentPath = window.location.pathname;
      const isOnLoginPage = currentPath.startsWith(paths.auth.login.path);

      if (!isOnLoginPage) {
        const redirectTo = currentPath;
        window.location.href = paths.auth.login.getHref(redirectTo);
      }

      return Promise.reject(error);
    } finally {
      isRefreshing = false;
    }
  }

  return Promise.reject(error);
};

api.interceptors.request.use(authRequestInterceptor);
api.interceptors.response.use((response) => {
  console.log("interceptor");
  console.log(response);
  console.log(response.data);

  return response.data;
}, refreshTokenIfNeeded);
