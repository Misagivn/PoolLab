import { Area } from '@/utils/types/area.types';

interface AreaResponse {
  status: number;
  message: string | null;
  data: Area[] | Area;
}

const BASE_URL = 'https://poollabwebapi20241008201316.azurewebsites.net/api';

export const areaApi = {
  getAllAreas: async (): Promise<AreaResponse> => {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${BASE_URL}/Area/GetAllArea`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.json();
  },

  getAreaById: async (areaId: string): Promise<AreaResponse> => {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${BASE_URL}/Area/GetAreaByID/${areaId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.json();
  },

  createArea: async (data: Omit<Area, 'id'>): Promise<AreaResponse> => {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${BASE_URL}/Area/AddNewArea`,
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

  updateArea: async (areaId: string, data: Omit<Area, 'id'>): Promise<AreaResponse> => {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${BASE_URL}/Area/UpdateArea/${areaId}`,
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

  deleteArea: async (areaId: string): Promise<AreaResponse> => {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${BASE_URL}/Area/DeleteRole/${areaId}`,
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


  uploadAreaImage: async (formData: FormData): Promise<AreaResponse> => {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${BASE_URL}/Area/UploadAreaImg`,
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