import axios from 'axios';

const BASE_URL = 'https://poollabwebapi20241008201316.azurewebsites.net/api';

const instance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

// Add a response interceptor
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear localStorage
      localStorage.clear();
      // Redirect to login page
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

instance.interceptors.request.use((config) => {
  // Get token from localStorage
  const token = localStorage.getItem('token');
  
  // If token exists, add it to headers
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    // If no token, redirect to login
    window.location.href = '/';
  }
  
  return {
    ...config,
    withCredentials: true
  };
});

export default instance;