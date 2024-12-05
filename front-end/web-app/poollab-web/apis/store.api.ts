import { Store, StoreResponse } from "@/utils/types/store";

export const storeApi = {
  getStoreById: async (storeId: string): Promise<StoreResponse> => {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_LOCAL_URL}/Store/GetStoreByID/${storeId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.json();
  },

  getAllStores: async (): Promise<StoreResponse> => {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_LOCAL_URL}/Store/GetAllStore`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.json();
  },

  createStore: async (storeData: Partial<Store>): Promise<StoreResponse> => {
    const token = localStorage.getItem('token');
    const companyId = localStorage.getItem('companyId');
    return fetch(
      `${process.env.NEXT_PUBLIC_LOCAL_URL}/store/addnewstore`,
      {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ...storeData, companyId })
      }
    ).then(res => res.json());
  },

  updateStore: async (storeId: string, storeData: Partial<Store>): Promise<StoreResponse> => {
    const token = localStorage.getItem('token');
    return fetch(
      `${process.env.NEXT_PUBLIC_LOCAL_URL}/store/updateinfostore/${storeId}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(storeData)
      }
    ).then(res => res.json());
  },

  deleteStore: async (storeId: string): Promise<StoreResponse> => {
    const token = localStorage.getItem('token');
    return fetch(
      `${process.env.NEXT_PUBLIC_LOCAL_URL}/store/deletestore/${storeId}`,
      {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      }
    ).then(res => res.json());
  },

  uploadImage: async (file: File): Promise<{ url: string }> => {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('file', file);
    
    return fetch(
      `${process.env.NEXT_PUBLIC_LOCAL_URL}/store/uploadstoreimg`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      }
    ).then(res => res.json());
  }
};