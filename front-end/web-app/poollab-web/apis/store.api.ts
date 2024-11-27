interface Store {
  id: string;
  name: string;
  address: string;
  storeImg: string;
  descript: string;
  phoneNumber: string;
  rated: number;
  timeStart: string | null;
  timeEnd: string | null;
  companyId: string | null;
  createdDate: string;
  updatedDate: string | null;
  status: string;
}

export const storeApi = {
  getStoreById: async (storeId: string): Promise<{data: Store}> => {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `https://poollabwebapi20241008201316.azurewebsites.net/api/Store/GetStoreByID/${storeId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.json();
  },

  getAllStores: async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `https://poollabwebapi20241008201316.azurewebsites.net/api/Store/GetAllStore`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.json();
  }
};