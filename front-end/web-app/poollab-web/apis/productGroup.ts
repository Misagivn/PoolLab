import { ProductGroup, ProductGroupResponse } from '@/utils/types/productGroup.types';

const BASE_URL = 'https://poollabwebapi20241008201316.azurewebsites.net/api';

export const groupApi = {
  getAllGroups: async (): Promise<ProductGroupResponse> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const response = await fetch(
        `${BASE_URL}/groupproduct/getallgroupproduct`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.json();
    } catch (error) {
      console.error('Error in getAllGroups:', error);
      throw error;
    }
  },

  createGroup: async (data: Omit<ProductGroup, 'id'>): Promise<{ status: number }> => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');

    const response = await fetch(
      `${BASE_URL}/groupproduct/createproducttype`,
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

  updateGroup: async (id: string, data: Omit<ProductGroup, 'id'>): Promise<{ status: number }> => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');

    const response = await fetch(
      `${BASE_URL}/groupproduct/updategroupproduct/${id}`,
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
      `${BASE_URL}/groupproduct/deletegroupproduct?id=${id}`,
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
