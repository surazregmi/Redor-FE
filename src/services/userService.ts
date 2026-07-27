import api from "@/services/api";
import type { ApiResponse } from "@/types/auth.types";
import type {
  AdminUser,
  UserListResponse,
  UpdateUserPayload,
} from "@/types/user.types";

export interface ListUsersParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export async function listUsers(
  params: ListUsersParams = {},
): Promise<UserListResponse> {
  const response = await api.get<ApiResponse<UserListResponse>>("/user", {
    params,
  });
  return response.data.data;
}

export async function getUserById(userId: string): Promise<AdminUser> {
  const response = await api.get<ApiResponse<AdminUser>>(`/user/${userId}`);
  return response.data.data;
}

export async function updateUser(
  userId: string,
  payload: UpdateUserPayload,
): Promise<AdminUser> {
  const response = await api.patch<ApiResponse<AdminUser>>(
    `/user/${userId}`,
    payload,
  );
  return response.data.data;
}

export async function deleteUser(userId: string): Promise<void> {
  await api.delete(`/user/${userId}`);
}
