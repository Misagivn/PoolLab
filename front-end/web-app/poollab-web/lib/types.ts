export interface Store {
  id: string;
  name: string;
}

export interface Company {
  id: string;
  name: string;
}

export interface LoginResponse {
  token: string;
  role: 'staff' | 'manager' | 'supermanager' | 'admin';
}

export interface LoginResponse {
  token: string;
  role: string;
}

export interface LoginPayload {
  email: string;
  password: string;
  storeId: string;
  companyId: string | null;
}

