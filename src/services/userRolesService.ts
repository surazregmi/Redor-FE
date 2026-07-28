import api from "@/services/api";
import type { ApiResponse } from "@/types/auth.types";
import { UserRolesResponse } from "@/types/userRoles.types";
export interface ListParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export async function listUserRoles(
  params: ListParams = {},
): Promise<UserRolesResponse> {
  const response = await api.get<ApiResponse<UserRolesResponse>>(
    "/user-roles",
    {
      params,
    },
  );
  return response.data.data;
}
