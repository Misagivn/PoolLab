const BASE_URL = 'https://poollabwebapi20241008201316.azurewebsites.net/api';

export const tableIssuesApi = {
  getAllTableIssues: async (storeId: string, page: number = 1, pageSize: number = 10) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const url = `${BASE_URL}/tableissues/getalltableissues?` +
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
        throw new Error('Failed to fetch table issues');
      }

      return response.json();
    } catch (error) {
      console.error('Error in getAllTableIssues:', error);
      throw error;
    }
  },

  getTableIssueById: async (issueId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const response = await fetch(
        `${BASE_URL}/tableissues/gettableissuesbyid/${issueId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch table issue details');
      }

      return response.json();
    } catch (error) {
      console.error('Error in getTableIssueById:', error);
      throw error;
    }
  },

  createMaintenance: async (data: {
    tableIssuesId: string;
    technicianId: string;
    cost: number;
    startDate: string;
    endDate: string;
  }) => {
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
  }
};