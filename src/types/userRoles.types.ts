export interface Role {
  id: string;
  name: string;
  description: string;
}

export interface UserRolesResponse {
  roles: Role[];
  total: number;
  page: number;
  limit: number;
}
