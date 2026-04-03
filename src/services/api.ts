import axios from "axios";
import { useAuthStore } from "@/store/authStore";
import { env } from "@/config/env";
import type { ApiResponse, RefreshTokenResponse } from "@/types/auth.types";

const api = axios.create({
  baseURL: env.API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;
    const isAuthEndpoint = originalRequest?.url?.includes("/auth/");

    if (err.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      originalRequest._retry = true;

      try {
        const { refreshToken, setAuth, user } = useAuthStore.getState();

        const { data } = await axios.post<ApiResponse<RefreshTokenResponse>>(
          `${env.API_BASE_URL}/auth/refresh`,
          { refreshToken },
        );

        setAuth({ user: user!, accessToken: data.data.accessToken, refreshToken: data.data.refreshToken });

        originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;
        return api(originalRequest);
      } catch {
        useAuthStore.getState().logout();
        window.location.href = "/signin";
      }
    }

    return Promise.reject(err);
  },
);

export default api;
