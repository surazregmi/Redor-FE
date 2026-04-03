import api from "./api";
import { useAuthStore } from "@/store/authStore";
import type { SignInFormData } from "@/validations/auth.schema";
import type { ApiResponse, SignInResponse } from "@/types/auth.types";

export async function signIn(data: SignInFormData): Promise<SignInResponse> {
  const response = await api.post<ApiResponse<SignInResponse>>("/auth/signin", data);
  return response.data.data;
}

export async function signOut(): Promise<void> {
  const { refreshToken } = useAuthStore.getState();
  try {
    await api.post("/auth/signout", { refreshToken });
  } finally {
    useAuthStore.getState().logout();
  }
}
