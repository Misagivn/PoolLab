export interface Staff {
  id: string;
  email: string;
  avatarUrl: string | null;
  userName: string;
  fullName: string;
  phoneNumber: string;
  roleId: string;
  roleName: string;
  storeId: string;
  balance: number;
  joinDate: string;
  status: string;
}

export interface StaffFormData {
  email: string;
  userName: string;
  passwordHash: string;
  fullName: string;
  phoneNumber: string;
  avatarUrl?: string;
}

export interface CreateStaffRequest extends StaffFormData {
  roleName: string;
  storeId: string;
  companyId: string | null;
}

export interface JWTPayload {
  storeId: string;
  [key: string]: any;
}

export interface StaffResponse {
  status: number;
  message: string | null;
  data: Staff[] | Staff;
}

export interface PaginatedStaffResponse {
  status: number;
  message: string | null;
  data: {
    items: Staff[];
    totalItem: number;
    pageSize: number;
    totalPages: number;
    pageNumber: number;
  };
}