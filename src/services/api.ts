import axios from "axios";
import {
  getAccessToken,
  getRefreshToken,
  setTokens,
  clearTokens,
} from "../utils/tokenHelpers";
import { useAuthStore } from "../store/authStore";

import { env } from "@/config/env";

const api = axios.create({
  baseURL: env.API_BASE_URL || "http://localhost:5000/api", // TODO:  replace later
});

// Attach token
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

//  Handle refresh token
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;

    if (err.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = getRefreshToken();

        const response = await axios.post(`${env.API_BASE_URL}/auth/refresh`, {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefresh } = response.data;

        setTokens(accessToken, newRefresh);

        useAuthStore.getState().setAuth({
          user: useAuthStore.getState().user,
          accessToken,
          refreshToken: newRefresh,
        });

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (error) {
        clearTokens();
        useAuthStore.getState().logout();
        window.location.href = "/signin";
      }
    }

    return Promise.reject(err);
  },
);

export default api;
