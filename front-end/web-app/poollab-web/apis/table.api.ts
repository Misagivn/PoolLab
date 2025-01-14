import { JWTPayload } from "@/helpers/jwt.helper";
import { BilliardTableFormData } from "@/utils/types/table.types";
import { jwtDecode } from "jwt-decode";

const BASE_URL = 'https://poollabwebapi20241008201316.azurewebsites.net/api';

export const billiardTableApi = {
  getAllTables: async (page: number = 1, pageSize: number = 10) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const decoded = jwtDecode(token) as { storeId: string };
      
      // Đảm bảo gửi đúng các tham số pagination
      const url = `${BASE_URL}/billiardtable/getallbilliardtable?` + 
                 `StroreID=${decoded.storeId}&` +
                 `PageNumber=${page}&` +
                 `PageSize=${pageSize}&` +
                 `SortBy=createdDate&` +
                 `SortAscending=false`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch tables');
      }

      return response.json();
    } catch (error) {
      console.error('Error in getAllTables:', error);
      throw error;
    }
  },

  getTableById: async (tableId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const response = await fetch(
        `${BASE_URL}/billiardtable/getbilliardtablebyid/${tableId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.json();
    } catch (error) {
      console.error('Error in getTableById:', error);
      throw error;
    }
  },

  createTable: async (data: BilliardTableFormData): Promise<any> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      // Lấy storeId từ token
      const decoded = jwtDecode(token) as { storeId: string };

      const response = await fetch(
        `${BASE_URL}/billiardtable/createnewtable`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ...data,
            storeId: decoded.storeId
          })
        }
      );
      return response.json();
    } catch (error) {
      console.error('Error in createTable:', error);
      throw error;
    }
  },

  updateTable: async (tableId: string, data: BilliardTableFormData): Promise<any> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const response = await fetch(
        `${BASE_URL}/billiardtable/updateinfotable/${tableId}`,
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
    } catch (error) {
      console.error('Error in updateTable:', error);
      throw error;
    }
  },

  deleteTable: async (tableId: string): Promise<any> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const response = await fetch(
        `${BASE_URL}/billiardtable/deletetable/${tableId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to delete table');
      }

      return response.json();
    } catch (error) {
      console.error('Error in deleteTable:', error);
      throw error;
    }
  },

  uploadImage: async (file: File): Promise<any> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(
        `${BASE_URL}/billiardtable/uploadfilebidatable`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: formData
        }
      );
      return response.json();
    } catch (error) {
      console.error('Error in uploadImage:', error);
      throw error;
    }
  },

  inactiveTable: async (tableId: string): Promise<any> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');
  
      const response = await fetch(
        `${BASE_URL}/billiardtable/inactivetable/${tableId}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
  
      if (!response.ok) {
        throw new Error('Failed to inactive table');
      }
  
      return response.json();
    } catch (error) {
      console.error('Error in inactiveTable:', error);
      throw error;
    }
  },
  
  updateTableStatus: async (tableId: string, status: string): Promise<any> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');
  
      const response = await fetch(
        `${BASE_URL}/billiardtable/updatestatustable/${tableId}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ status })
        }
      );
  
      if (!response.ok) {
        throw new Error('Failed to update table status');
      }
  
      return response.json();
    } catch (error) {
      console.error('Error in updateTableStatus:', error);
      throw error;
    }
  },
};
