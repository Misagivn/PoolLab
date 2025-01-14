import { CreateMaintenanceRequest } from "@/utils/types/tableMaintenance.types";

const BASE_URL = 'https://poollabwebapi20241008201316.azurewebsites.net/api';

export const tableMaintenanceApi = {
  getAllTableMaintenance: async (storeId: string, page: number = 1, pageSize: number = 10) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const url = `${BASE_URL}/tablemaintenance/getalltablemaintenance?` +
                 `StoreId=${storeId}&` +
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
        throw new Error('Failed to fetch maintenance records');
      }

      return response.json();
    } catch (error) {
      console.error('Error in getAllTableMaintenance:', error);
      throw error;
    }
  },

  createMaintenance: async (data: CreateMaintenanceRequest) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const response = await fetch(
        `${BASE_URL}/tablemaintenance/createtablemaintenancebyissues`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        }
      );

      if (!response.ok) {
        throw new Error('Failed to create maintenance record');
      }

      return response.json();
    } catch (error) {
      console.error('Error in createMaintenance:', error);
      throw error;
    }
  },

  updateMaintenanceStatus: async (maintenanceId: string, status: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const response = await fetch(
        `${BASE_URL}/tablemaintenance/updatetablemaintenancestatus/${maintenanceId}`,
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
        throw new Error('Failed to update maintenance status');
      }

      return response.json();
    } catch (error) {
      console.error('Error in updateMaintenanceStatus:', error);
      throw error;
    }
  }
};