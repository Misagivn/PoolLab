import { useState, useCallback } from 'react';
import { useToast } from '@chakra-ui/react';
import { Product } from '@/utils/types/product.types';
import { productApi } from '@/apis/product.api';

export const useProduct = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await productApi.getAllProducts();
      if (response.status === 200) {
        setProducts(Array.isArray(response.data) ? response.data : [response.data]);
      }
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Không thể tải danh sách sản phẩm',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const deleteProduct = async (productId: string) => {
    try {
      const response = await productApi.deleteProduct(productId);
      if (response.status === 200) {
        await fetchProducts();
        return response.data;
      }
    } catch (error) {
      throw error;
    }
  };

  const uploadImage = async (file: File) => {
    try {
      const response = await productApi.uploadProductImage(file);
      if (response.status === 200) {
        return response.data;
      }
      throw new Error('Upload failed');
    } catch (error) {
      throw error;
    }
  };

  return {
    products,
    loading,
    fetchProducts,
    deleteProduct,
    uploadImage
  };
};