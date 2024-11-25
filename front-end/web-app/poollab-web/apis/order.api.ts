import { OrderResponse, OrderDetailResponse } from '@/utils/types/order.types';

const BASE_URL = 'https://poollabwebapi20241008201316.azurewebsites.net/api';

export const orderApi = {
  getAllOrders: async (token: string): Promise<OrderResponse> => {
    const response = await fetch(`${BASE_URL}/Order/GetAllOrder`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.json();
  },

  getOrderById: async (orderId: string, token: string): Promise<OrderDetailResponse> => {
    const response = await fetch(`${BASE_URL}/Order/GetOrderById/${orderId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.json();
  }
};