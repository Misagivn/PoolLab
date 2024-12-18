import { BilliardPriceFormData } from "@/utils/types/billliardPrice.types";

const BASE_URL = 'https://poollabwebapi20241008201316.azurewebsites.net/api';
export const billiardPriceApi = {
  getAllPrices: async (token: string) => {
    try {
      const token = localStorage.getItem('token');
      console.log(token);
      const response = await fetch(
        `${BASE_URL}/BilliardPrice/GetAllBilliardPrice`,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          
        }
      );
      
      
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      throw new Error('Failed to fetch prices');
    }
  },
  createPrice: async (data: Omit<BilliardPriceFormData, 'id'>): Promise<{ status: number }> => {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${BASE_URL}/billiardprice/addnewbilliardprice`,
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

  updatePrice: async (id: string, data: Omit<BilliardPriceFormData, 'id'>): Promise<{ status: number }> => {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${BASE_URL}/billiardprice/updatebilliardprice/${id}`,
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

  deletePrice: async (id: string): Promise<{ status: number }> => {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${BASE_URL}/billiardprice/deletebilliardprice/${id}`,
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