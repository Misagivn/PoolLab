import { OrderDetailResponse, OrderResponse } from "@/utils/types/order.types";

const BASE_URL = 'https://poollabwebapi20241008201316.azurewebsites.net/api';

export const orderApi = {
  getAllOrders: async (params: {
    token: string;
    pageNumber?: number;
    pageSize?: number;
    username?: string;
  }): Promise<OrderResponse> => {
    const { token, pageNumber = 1, pageSize = 10, username = '' } = params;
    
    const queryParams = new URLSearchParams({
      PageNumber: pageNumber.toString(),
      PageSize: pageSize.toString(),
      SortBy: 'orderDate',
      SortAscending: 'false'
    });

    if (username) {
      queryParams.append('Username', username);
    }


    const response = await fetch(
      `${BASE_URL}/Order/GetAllOrder?${queryParams.toString()}`, 
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