export interface Role {
  id: string;
  name: string;
  description: string;
}

export interface RoleSelectInput {
  key: string;
  value: string;
}

export interface UserRolesResponse {
  roles: Role[];
  total: number;
  page: number;
  limit: number;
}
