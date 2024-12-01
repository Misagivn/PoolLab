import { UnitResponse } from '@/utils/types/unit.types';

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
  }
};