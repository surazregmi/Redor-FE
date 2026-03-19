import { create } from "zustand";

interface AuthState {
  user: any;
  accessToken: string | null;
  refreshToken: string | null;
  setAuth: (data: any) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  refreshToken: null,

  setAuth: (data) =>
    set({
      user: data.user,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    }),

  logout: () =>
    set({
      user: null,
      accessToken: null,
      refreshToken: null,
    }),
}));
