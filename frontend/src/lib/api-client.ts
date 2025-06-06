import Axios from "axios";
import { paths } from "@/config/paths";

export const api = Axios.create({
  baseURL: process.env.VITE_APP_API_URL,
});

api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response?.status === 401) {
      const redirectTo = window.location.pathname;
      window.location.href = paths.auth.login.getHref(redirectTo);
    }

    return Promise.reject(error);
  }
);
