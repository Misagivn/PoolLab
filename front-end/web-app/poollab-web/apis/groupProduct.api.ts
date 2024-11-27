import { ProductGroupResponse } from '@/utils/types/group.types';

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
  }
};
