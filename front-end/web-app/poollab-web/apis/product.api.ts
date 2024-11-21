import { 
  CreateProductRequest, 
  UpdateProductRequest, 
  ProductResponse 
} from '@/utils/types/product.types';

const BASE_URL = 'https://poollabwebapi20241008201316.azurewebsites.net/api';

export const productApi = {
  getAllProducts: async (): Promise<ProductResponse> => {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${BASE_URL}/Product/GetAllProducts`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.json();
  },

  getProductById: async (productId: string): Promise<ProductResponse> => {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${BASE_URL}/Product/GetProductByID/${productId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.json();
  },

  createProduct: async (data: CreateProductRequest): Promise<ProductResponse> => {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${BASE_URL}/Product/CreateProduct`,
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

  updateProduct: async (productId: string, data: UpdateProductRequest): Promise<ProductResponse> => {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${BASE_URL}/Product/UpdateProduct/${productId}`,
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

  deleteProduct: async (productId: string): Promise<ProductResponse> => {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${BASE_URL}/Product/DeleteProduct?id=${productId}`,
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

  uploadProductImage: async (file: File): Promise<ProductResponse> => {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(
      `${BASE_URL}/Product/UploadFileProductImg`,
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