import { ProductTypeResponse } from '@/utils/types/type.types';

const BASE_URL = 'https://poollabwebapi20241008201316.azurewebsites.net/api';
export const typeApi = {
  getAllTypes: async (): Promise<ProductTypeResponse> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

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
};