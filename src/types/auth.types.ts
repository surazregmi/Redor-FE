export interface ApiResponse<T> {
  message: string;
  data: T;
}

export interface User {
  id: string; // BigInt serialized as string by backend
  email: string;
  firstName: string;
  lastName: string;
  tenantId: number;
  roles: string[];
}

export interface SignInResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}
