import { CreateStaffRequest, PaginatedStaffResponse, StaffResponse, UpdateStaffRequest } from '@/utils/types/staff.types';

const BASE_URL = 'https://poollabwebapi20241008201316.azurewebsites.net/api';
const ROLE_ID = '21cfbbf3-ccd1-4394-b0e9-ee0e42564b87'; // Staff role ID

export const staffApi = {
  getAllStaff: async (storeId: string): Promise<PaginatedStaffResponse> => {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${BASE_URL}/Account/GetAllAccount?RoleId=${ROLE_ID}&StoreId=${storeId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.json();
  },

  getStaffById: async (staffId: string): Promise<StaffResponse> => {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${BASE_URL}/Account/GetAccountByID/${staffId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.json();
  },

  createStaff: async (data: CreateStaffRequest): Promise<StaffResponse> => {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${BASE_URL}/Account/CreateNewAccount`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      }
    );
    return response.json();
  },

  uploadAvatar: async (file: File): Promise<StaffResponse> => {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(
      `${BASE_URL}/Account/UploadFileAvatar`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData
      }
    );
    return response.json();
  },

  updateStaff: async (staffId: string, data: UpdateStaffRequest): Promise<StaffResponse> => {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${BASE_URL}/Account/UpdateInfoUser/${staffId}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      }
    );
    return response.json();
  }
};