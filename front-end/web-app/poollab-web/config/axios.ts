import axios from 'axios';

const BASE_URL = 'https://poollabwebapi20241008201316.azurewebsites.net/api';

const instance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

instance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    window.location.href = '/';
  }
  
  return {
    ...config,
    withCredentials: true
  };
});

export default instance;