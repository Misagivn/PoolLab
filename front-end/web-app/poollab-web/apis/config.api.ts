import { ConfigResponse } from "@/utils/types/config.type";
import { Config } from "tailwindcss";

const BASE_URL = 'https://poollabwebapi20241008201316.azurewebsites.net/api';

export const configApi = {
  getConfig: async (): Promise<ConfigResponse> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${BASE_URL}/config/getconfigbyname`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.json();
  },

  createConfig: async (data: Omit<Config, 'id' | 'name' | 'createdDate' | 'updateDate' | 'status'>): Promise<ConfigResponse> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${BASE_URL}/config/addnewconfig`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    return response.json();
  },

  updateConfig: async (data: Omit<Config, 'id' | 'name' | 'createdDate' | 'updateDate' | 'status'>): Promise<ConfigResponse> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${BASE_URL}/config/updateconfig`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    return response.json();
  }
};