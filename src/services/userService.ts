import api from "@/services/api";
import type { ApiResponse } from "@/types/auth.types";
import type {
  User,
  UserListResponse,
  UpdateUserPayload,
  AddUserPayload,
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

export async function getUserById(userId: string): Promise<User> {
  const response = await api.get<ApiResponse<User>>(`/user/${userId}`);
  return response.data.data;
}

export async function updateUser(
  userId: string,
  payload: UpdateUserPayload,
): Promise<User> {
  const response = await api.patch<ApiResponse<User>>(
    `/user/${userId}`,
    payload,
  );
  return response.data.data;
}

export async function createUser(
  payload: AddUserPayload,
): Promise<User> {
  const response = await api.post<ApiResponse<User>>(
    `/user`,
    payload,
  );
  return response.data.data;
}

export async function deleteUser(userId: string): Promise<void> {
  await api.delete(`/user/${userId}`);
}
