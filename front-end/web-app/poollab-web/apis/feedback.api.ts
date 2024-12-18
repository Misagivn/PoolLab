import { ReviewResponse } from "@/utils/types/feedback.types";

const BASE_URL = 'https://poollabwebapi20241008201316.azurewebsites.net/api';

export const reviewApi = {
  getAllReviews: async (
    page: number = 1,
    filters: {
      username?: string,
      storeName?: string
    } = {}
  ): Promise<ReviewResponse> => {
    const token = localStorage.getItem('token');
    let url = `${BASE_URL}/review/getallreview?SortBy=createdDate&SortAscending=false&PageNumber=${page}&PageSize=10`;
    
    if (filters.username) {
      url += `&Username=${encodeURIComponent(filters.username)}`;
    }
    if (filters.storeName) {
      url += `&StoreName=${encodeURIComponent(filters.storeName)}`;
    }

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.json();
  }
};