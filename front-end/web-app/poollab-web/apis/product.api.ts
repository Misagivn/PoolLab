import { Product, PaginatedResponse, ProductFilters, CreateProductDTO, ProductDetailResponse, UpdateProductDTO } from '@/utils/types/product';
import { jwtDecode } from 'jwt-decode';

const BASE_URL = 'https://poollabwebapi20241008201316.azurewebsites.net/api';

interface JWTPayload {
  storeId: string;
  [key: string]: any;
}

export const productApi = {
  getAllProducts: async (
    pageNumber: number = 1, 
    pageSize: number = 10,
    filters?: ProductFilters
  ): Promise<PaginatedResponse<Product>> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const decoded = jwtDecode(token) as JWTPayload;
      const storeId = decoded.storeId;

      if (!storeId) throw new Error('No store ID found in token');

      const queryParams = new URLSearchParams({
        PageNumber: pageNumber.toString(),
        PageSize: pageSize.toString(),
        StoreId: storeId
      });
      if (filters) {
        if (filters.search) queryParams.append('Search', filters.search);
        if (filters.groupName && filters.groupName !== 'all') queryParams.append('GroupName', filters.groupName);
        if (filters.status && filters.status !== 'all') queryParams.append('Status', filters.status);
      }

      const response = await fetch(
        `${BASE_URL}/Product/GetAllProducts?${queryParams.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.json();
    } catch (error) {
      console.error('Error in getAllProducts:', error);
      throw error;
    }
  },

  createProduct: async (data: CreateProductDTO): Promise<PaginatedResponse<Product>> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const decoded = jwtDecode(token) as JWTPayload;
      const storeId = decoded.storeId;

      if (!storeId) throw new Error('No store ID found in token');

      const response = await fetch(
        `${BASE_URL}/Product/CreateProduct`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ...data,
            storeId
          })
        }
      );
      return response.json();
    } catch (error) {
      console.error('Error in createProduct:', error);
      throw error;
    }
  },

  updateProduct: async (id: string, data: UpdateProductDTO): Promise<any> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const response = await fetch(
        `${BASE_URL}/product/updateproduct/${id}`,
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
    } catch (error) {
      console.error('Error in updateProduct:', error);
      throw error;
    }
  },

  deleteProduct: async (id: string): Promise<PaginatedResponse<Product>> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const decoded = jwtDecode(token) as JWTPayload;
      const storeId = decoded.storeId;

      if (!storeId) throw new Error('No store ID found in token');

      const product = await this.getProductById(id);
      if (product.data.storeId !== storeId) {
        throw new Error('Unauthorized: Product does not belong to this store');
      }

      const response = await fetch(
        `${BASE_URL}/Product/DeleteProduct/${id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.json();
    } catch (error) {
      console.error('Error in deleteProduct:', error);
      throw error;
    }
  },

  getProductDetail: async (id: string): Promise<ProductDetailResponse> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const response = await fetch(
        `${BASE_URL}/Product/GetProductById/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.json();
    } catch (error) {
      console.error('Error in getProductDetail:', error);
      throw error;
    }
  },

  uploadProductImage: async (file: File): Promise<{ status: number; message: string | null; data: string }> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(
        `${BASE_URL}/Product/UploadFileProductImg`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: formData
        }
      );
      return response.json();
    } catch (error) {
      console.error('Error in uploadProductImage:', error);
      throw error;
    }
  }
};