export interface UserTenantRole {
  tenantId: number;
  assignedAt: string;
  role: {
    id: number;
    name: string;
  };
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  isActive: boolean;
  emailVerified: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
  createdById: string | null;
  userTenantRoles: UserTenantRole[];
}

export interface UserListResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
}

export interface UpdateUserPayload {
  firstName?: string;
  lastName?: string;
  email?: string;
  isActive?: boolean;
}
export interface AddUserPayload {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    roleId: number;
}
