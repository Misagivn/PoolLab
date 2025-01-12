import { BilliardTableFormData } from "@/utils/types/table.types";

const BASE_URL = 'https://poollabwebapi20241008201316.azurewebsites.net/api';

export const billiardTableApi = {
  getAllTables: async (page: number = 1, pageSize: number = 10, storeId?: string) => {
    const token = localStorage.getItem('token');
    const url = new URL(`${BASE_URL}/billiardtable/getallbilliardtable`);
    
    // Add query parameters
    url.searchParams.append('PageNumber', page.toString());
    url.searchParams.append('PageSize', pageSize.toString());
    url.searchParams.append('SortBy', 'createdDate');
    url.searchParams.append('SortAscending', 'false');
    if (storeId) {
      url.searchParams.append('StoreID', storeId);
    }
    
    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.json();
  },
  
  getTableById: async (id: string) => {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${BASE_URL}/billiardtable/getbilliardtablebyid/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.json();
  },

  createTable: async (data: Omit<BilliardTableFormData, 'id'>) => {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${BASE_URL}/billiardtable/createnewtable`,
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

  updateTable: async (id: string, data: Omit<BilliardTableFormData, 'id'>) => {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${BASE_URL}/billiardtable/updateinfotable/${id}`,
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

  deleteTable: async (id: string) => {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${BASE_URL}/billiardtable/deletetable/${id}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.json();
  },

  uploadImage: async (formData: FormData) => {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${BASE_URL}/billiardtable/uploadfilebidatable`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData
      }
    );
    return response.json();
  }
};