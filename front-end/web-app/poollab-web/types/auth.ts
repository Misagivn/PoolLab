export interface LoginResponse {
  status: number;
  message: string;
  data: string;
}

export interface JWTPayload {
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': string;
  accountId: string;
  username: string;
  fullName: string;
  storeId?: string;
  companyId?: string;
  exp: number;
  iat: number;
  iss: string;
  aud: string[];
}

export type UserRole = 'Staff' | 'Manager' | 'Super Manager' | 'Admin';

export interface UserInfo {
  accountId: string;
  username: string;
  fullName: string;
  role: string;
  storeId?: string;
  companyId?: string;
}