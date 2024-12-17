import { BilliardType } from "@/utils/types/table.types";

const BASE_URL = 'https://poollabwebapi20241008201316.azurewebsites.net/api';

export const billiardTypeApi = {
  getAllTypes: async (): Promise<{ status: number; data: BilliardType[] }> => {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${BASE_URL}/billiardtype/getallbilliardtype`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.json();
  },

  createType: async (data: Omit<BilliardType, 'id'>): Promise<{ status: number }> => {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${BASE_URL}/billiardtype/addnewbilliardtype`,
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

  updateType: async (id: string, data: Omit<BilliardType, 'id'>): Promise<{ status: number }> => {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${BASE_URL}/billiardtype/updatebilliardtype/${id}`,
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

  deleteType: async (id: string): Promise<{ status: number }> => {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${BASE_URL}/billiardtype/deletebilliardtype/${id}`,
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