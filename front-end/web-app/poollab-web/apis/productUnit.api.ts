import { Unit, UnitResponse } from '@/utils/types/productUnit.types';

const BASE_URL = 'https://poollabwebapi20241008201316.azurewebsites.net/api';
export const unitApi = {
  getAllUnits: async (): Promise<UnitResponse> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const response = await fetch(
        `${BASE_URL}/unit/getallunit`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.json();
    } catch (error) {
      console.error('Error in getAllUnits:', error);
      throw error;
    }
  },

  createGroup: async (data: Omit<Unit, 'id'>): Promise<{ status: number }> => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');

    const response = await fetch(
      `${BASE_URL}/unit/createproducttype`,
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

  updateGroup: async (id: string, data: Omit<Unit, 'id'>): Promise<{ status: number }> => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');

    const response = await fetch(
      `${BASE_URL}/unit/updateunit/${id}`,
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

  deleteGroup: async (id: string): Promise<{ status: number }> => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');

    const response = await fetch(
      `${BASE_URL}/unit/deleteunit?id=${id}`,
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