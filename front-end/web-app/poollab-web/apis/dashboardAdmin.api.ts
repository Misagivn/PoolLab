const BASE_URL = 'https://poollabwebapi20241008201316.azurewebsites.net/api/dashboard';

export const dashboardApi = {
  getTotalIncome: async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${BASE_URL}/gettotalincome`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.json();
  },

  getTotalOrders: async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${BASE_URL}/getallorder`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.json();
  },

  getTotalBookings: async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${BASE_URL}/getallbooking`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.json();
  },

  getTotalStaff: async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${BASE_URL}/getallstaff`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.json();
  },

  getStoreIncomeByFilter: async (storeId: string, year: number, month: number) => {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${BASE_URL}/getincomeofstorebyfilter?StoreId=${storeId}&year=${year}&month=${month}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    return response.json();
  },

  getStoreRevenuesByYear: async (year: number) => {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${BASE_URL}/getallstorehaveincomeinyear?year=${year}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    return response.json();
  }
};