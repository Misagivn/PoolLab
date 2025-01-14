import { ApiResponse, DailyStats } from "@/utils/types/dashboardMana.types";

const BASE_URL = 'https://poollabwebapi20241008201316.azurewebsites.net/api/dashboard';

export const managerDashboardApi = {
  getStoreIncome: async (storeId: string): Promise<ApiResponse<string>> => {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${BASE_URL}/getincomeofstore/${storeId}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    return response.json();
  },

  getStoreOrders: async (storeId: string): Promise<ApiResponse<string>> => {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${BASE_URL}/getallorderofstore/${storeId}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    return response.json();
  },

  getStoreMembers: async (storeId: string): Promise<ApiResponse<string>> => {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${BASE_URL}/getallmemberofstore/${storeId}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    return response.json();
  },

  getStoreReviews: async (storeId: string): Promise<ApiResponse<string>> => {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${BASE_URL}/getallreviewofstore/${storeId}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    return response.json();
  },

  getStoreDailyStats: async (storeId: string, year: number, month: number): Promise<ApiResponse<DailyStats[]>> => {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${BASE_URL}/getincomeofstorebyfilter?StoreId=${storeId}&year=${year}&month=${month}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    return response.json();
  }
};