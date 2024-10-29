import axios from 'axios';
import { LoginPayload } from './types';

const BASE_URL = 'https://poollabwebapi20241008201316.azurewebsites.net/api';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const authApi = {
  login: async (payload: LoginPayload) => {
    try {
      console.log('Login Payload:', payload); // Log payload trước khi gửi

      // Đảm bảo storeId và companyId là GUID hợp lệ hoặc null
      const loginData = {
        email: payload.email,
        password: payload.password,
        storeId: payload.storeId || null,
        companyId: payload.companyId || null
      };

      console.log('Processed Login Data:', loginData); // Log data đã xử lý

      const response = await axiosInstance.post('/Auth/LoginStaff', loginData);
      console.log('Login Response:', response.data); // Log response
      return response;
    } catch (error: any) {
      console.error('Login Error:', error.response?.data || error); // Log error details
      throw error;
    }
  },

  getAllStores: async () => {
    try {
      const response = await axiosInstance.get('/Store/GetAllStore');
      console.log('Stores Response:', response.data);
      return response;
    } catch (error) {
      console.error('Get Stores Error:', error);
      throw error;
    }
  },

  getAllCompanies: async () => {
    try {
      const response = await axiosInstance.get('/Company/GetAllCompany');
      console.log('Companies Response:', response.data);
      return response;
    } catch (error) {
      console.error('Get Companies Error:', error);
      throw error;
    }
  }
};