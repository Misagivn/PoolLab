import { Store, StoreResponse } from "@/utils/types/store";

const BASE_URL = 'https://poollabwebapi20241008201316.azurewebsites.net/api';

export const storeApi = {
  getAllStores: async (page: number = 1, pageSize: number = 10): Promise<StoreResponse> => {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${BASE_URL}/store/getallstore?SortBy=createdDate&SortAscending=false&PageNumber=${page}&PageSize=${pageSize}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.json();
  },

  getStoreById: async (storeId: string): Promise<StoreResponse> => {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${BASE_URL}/store/getstorebyid/${storeId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.json();
  },

  createStore: async (data: Omit<Store, 'id' | 'rated' | 'createdDate' | 'updatedDate' | 'status' | 'companyId'>): Promise<StoreResponse> => {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${BASE_URL}/store/addnewstore`,
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

  uploadStoreImage: async (formData: FormData): Promise<StoreResponse> => {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${BASE_URL}/store/uploadstoreimg`,
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

  updateStore: async (storeId: string, data: Omit<Store, 'id' | 'rated' | 'createdDate' | 'updatedDate' | 'status' | 'companyId'>): Promise<StoreResponse> => {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${BASE_URL}/store/updateinfostore/${storeId}`,
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
  },
  
  deleteStore: async (storeId: string): Promise<StoreResponse> => {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${BASE_URL}/store/deletestore/${storeId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.json();
  }
};