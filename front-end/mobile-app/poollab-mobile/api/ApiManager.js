import axios from "axios";
import { getStoredToken } from "@/api/tokenDecode";

const ApiManager = axios.create({
  baseURL: "https://poollabwebapi20241008201316.azurewebsites.net/api",
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PATCH, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers":
      "X-Requested-With, content-type, Authorization",
  },
  responseType: "json",
  withCredentials: true,
});
// Interceptor to add authorization token to each request

ApiManager.interceptors.request.use(
  async (config) => {
    try {
      const token = await getStoredToken();
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      return config;
    } catch (error) {
      console.error("Error retrieving token", error);
      return config;
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);
// Multipart form data method with improved FormData creation
ApiManager.uploadFile = async (endpoint, file, additionalData = {}) => {
  const formData = new FormData();

  // Carefully construct file upload
  formData.append("file", {
    uri: file.uri,
    type: file.type || "image/jpeg",
    name: file.name || "upload.jpg",
    base64: file.base64,
  });

  // Append additional form data fields if provided
  Object.keys(additionalData).forEach((key) => {
    formData.append(key, additionalData[key]);
  });

  try {
    const response = await ApiManager.post(endpoint, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Accept: "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Upload error details:",
      error.response ? error.response.data : error
    );
    throw error;
  }
};

export default ApiManager;
