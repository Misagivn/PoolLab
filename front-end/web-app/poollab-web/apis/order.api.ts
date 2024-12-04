import { OrderDetailResponse, OrderResponse } from "@/utils/types/order.types";

const BASE_URL = 'https://poollabwebapi20241008201316.azurewebsites.net/api';

export const orderApi = {
  getAllOrders: async (params: {
    token: string;
    pageNumber?: number;
    pageSize?: number;
  }): Promise<OrderResponse> => {
    const { token, pageNumber = 1, pageSize = 10 } = params;
    const response = await fetch(
      `${BASE_URL}/Order/GetAllOrder?PageNumber=${pageNumber}&PageSize=${pageSize}`, 
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
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