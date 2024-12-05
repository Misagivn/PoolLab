import { CreateProductPayload, ProductResponse, UpdateProductPayload } from "@/utils/types/product";

const BASE_URL = 'https://poollabwebapi20241008201316.azurewebsites.net/api';

export const productApi = {
  getAllProducts: async (storeId: string): Promise<ProductResponse> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const response = await fetch(
        `${BASE_URL}/product/getallproducts?storeId=${storeId}`,
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

  getProductById: async (productId: string): Promise<ProductResponse> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const response = await fetch(
        `${BASE_URL}/product/getproductbyid/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.json();
    } catch (error) {
      console.error('Error in getProductById:', error);
      throw error;
    }
  },

  createProduct: async (data: CreateProductPayload): Promise<any> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const response = await fetch(
        `${BASE_URL}/product/createproduct`,
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
    } catch (error) {
      console.error('Error in createProduct:', error);
      throw error;
    }
  },

  updateProduct: async (productId: string, data: UpdateProductPayload): Promise<any> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');
      console.log('Update payload:', data);

      const response = await fetch(
        `${BASE_URL}/product/updateproduct/${productId}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: data.name,
            descript: data.descript,
            quantity: parseInt(data.quantity.toString()),
            minQuantity: parseInt(data.minQuantity.toString()),
            price: parseInt(data.price.toString()),
            productImg: data.productImg,
            productTypeId: data.productTypeId,
            productGroupId: data.productGroupId,
            unitId: data.unitId,
            status: data.status
          })
        }
      );

      const result = await response.json();
      console.log('Update response:', result);
      return result;
    } catch (error) {
      console.error('Error in updateProduct:', error);
      throw error;
    }
  },

  deleteProduct: async (productId: string): Promise<any> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const response = await fetch(
        `${BASE_URL}/product/deleteproduct/${productId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      return response.json();
    } catch (error) {
      console.error('Error in deleteProduct:', error);
      throw error;
    }
  },

  uploadProductImage: async (file: File): Promise<any> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(
        `${BASE_URL}/product/uploadfileproductimg`,
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