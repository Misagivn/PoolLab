const BASE_URL = 'https://poollabwebapi20241008201316.azurewebsites.net/api/dashboard';

interface DashboardResponse<T> {
  status: number;
  message: string;
  data: T;
}

interface StoreRevenue {
  branchId: string;
  branchName: string;
  revenueByMonth: {
    month: number;
    orderRevenue: number;
    depositRevenue: number;
    totalRevenue: number;
  }[];
}

interface DailyRevenue {
  date: string;
  totalIncome: number;
  totalOrder: number;
  totalBooking: number;
}

export const dashboardApi = {
  getTotalIncome: async (): Promise<DashboardResponse<number>> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${BASE_URL}/gettotalincome`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.json();
  },

  getTotalOrders: async (): Promise<DashboardResponse<number>> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${BASE_URL}/getallorder`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.json();
  },

  getTotalBookings: async (): Promise<DashboardResponse<number>> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${BASE_URL}/getallbooking`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.json();
  },

  getStoreRevenues: async (year: number): Promise<DashboardResponse<StoreRevenue[]>> => {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${BASE_URL}/getallstorehaveincomeinyear?year=${year}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.json();
  },

  getStoreRevenuesByYear: async (year: number): Promise<any> => {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${BASE_URL}/getallstorehaveincomeinyear?year=${year}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.json();
  },

  getStoreRevenueByMonth: async (
    storeId: string,
    year: number,
    month: number
  ): Promise<DashboardResponse<DailyRevenue[]>> => {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${BASE_URL}/getincomeofstorebyfilter?StoreId=${storeId}&year=${year}&month=${month}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.json();
  },
};