import { StoreResponse } from "@/utils/types/store";

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
  }
};