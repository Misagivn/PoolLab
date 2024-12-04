import { ApiResponse, TableDetail, UpdateTableData } from "@/utils/types/table.types";

const BASE_URL = 'https://poollabwebapi20241008201316.azurewebsites.net/api';

export const billiardTableApi = {
  getAllTables: async (params: {
    pageNumber?: number;
    pageSize?: number;
    token: string;
  }) => {
    try {
      const { pageNumber = 1, pageSize = 10, token } = params;
      
      const response = await fetch(
        `${BASE_URL}/BilliardTable/GetAllBilliardTable?PageNumber=${pageNumber}&PageSize=${pageSize}`,
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
      throw new Error('Failed to fetch tables');
    }
  },

  createTable: async (tableData: any, token: string) => {
    try {
      const response = await fetch(
        `${BASE_URL}/BilliardTable/CreateNewTable`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(tableData),
        }
      );

      if (!response.ok) throw new Error('Failed to create table');
      return await response.json();
    } catch (error) {
      throw new Error('Error creating table');
    }
  },

  uploadImage: async (file: File, token: string) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(
        `${BASE_URL}/BilliardTable/UploadFileBidaTable`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      if (!response.ok) throw new Error('Failed to upload image');
      return await response.json();
    } catch (error) {
      throw new Error('Error uploading image');
    }
  },

  deleteTable: async (tableId: string, token: string) => {
    try {
      const response = await fetch(
        `${BASE_URL}/BilliardTable/DeleteTable/${tableId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) throw new Error('Failed to delete table');
      return await response.json();
    } catch (error) {
      throw new Error('Error deleting table');
    }
  },

  getTableById: async (tableId: string, token: string): Promise<ApiResponse<TableDetail>> => {
    try {
      const response = await fetch(
        `${BASE_URL}/BilliardTable/GetBilliardTableByID/${tableId}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch table detail');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw new Error('Error fetching table detail');
    }
  },

  updateTable: async (tableId: string, data: UpdateTableData, token: string): Promise<ApiResponse<any>> => {
    try {
      const response = await fetch(
        `${BASE_URL}/BilliardTable/UpdateInfoTable/${tableId}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) throw new Error('Failed to update table');
      return await response.json();
    } catch (error) {
      throw new Error('Error updating table');
    }
  },

  updateTableStatus: async (tableId: string, status: string, token: string): Promise<ApiResponse<any>> => {
    try {
      const response = await fetch(
        `${BASE_URL}/BilliardTable/UpdateStatusTable/${tableId}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status }),
        }
      );

      if (!response.ok) throw new Error('Failed to update table status');
      return await response.json();
    } catch (error) {
      throw new Error('Error updating table status');
    }
  },
  
};