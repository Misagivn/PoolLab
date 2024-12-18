import { ProductType, ProductTypeResponse } from '@/utils/types/productType.types';

const BASE_URL = 'https://poollabwebapi20241008201316.azurewebsites.net/api';
export const typeApi = {
  getAllTypes: async (): Promise<ProductTypeResponse> => {
    try {
      
      const token = localStorage.getItem('token');
      // if (!token) throw new Error('No token found');
      console.log(token)
      const response = await fetch(
        
        `${BASE_URL}/producttype/getallproducttypes`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.json();
    } catch (error) {
      console.error('Error in getAllTypes:', error);
      throw error;
    }
  },

  createType: async (data: Omit<ProductType, 'id'>): Promise<{ status: number }> => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');

    const response = await fetch(
      `${BASE_URL}/producttype/createproducttype`,
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

  updateType: async (id: string, data: Omit<ProductType, 'id'>): Promise<{ status: number }> => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');

    const response = await fetch(
      `${BASE_URL}/producttype/updateproducttype/${id}`,
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
    if (!token) throw new Error('No token found');

    const response = await fetch(
      `${BASE_URL}/producttype/deleteproducttype?id=${id}`,
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