'use client';

import { useState, useCallback } from 'react';
import { useToast } from '@chakra-ui/react';
import { Product, CreateProductPayload, UpdateProductPayload } from '@/utils/types/product';
import { productApi } from '@/apis/product.api';
import { jwtDecode } from 'jwt-decode';

export const useProduct = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const fetchProducts = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const decoded = jwtDecode(token) as { storeId: string };
      const response = await productApi.getAllProducts(decoded.storeId);
      
      if (response.status === 200) {
        setProducts(response.data.items);
      }
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Không thể tải danh sách sản phẩm',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const createProduct = async (data: Omit<CreateProductPayload, 'storeId'>) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const decoded = jwtDecode(token) as { storeId: string };
      const response = await productApi.createProduct({
        ...data,
        storeId: decoded.storeId
      });

      if (response.status === 200) {
        toast({
          title: 'Thành công',
          description: 'Thêm sản phẩm mới thành công',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        await fetchProducts();
      }
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Không thể thêm sản phẩm mới',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (productId: string, data: UpdateProductPayload) => {
    try {
      setLoading(true);
      
      // Đảm bảo tất cả trường được gửi đi
      const updatePayload = {
        name: data.name,
        descript: data.descript,
        quantity: data.quantity,
        minQuantity: data.minQuantity,
        price: data.price,
        productImg: data.productImg,
        productTypeId: data.productTypeId,
        productGroupId: data.productGroupId,
        unitId: data.unitId,
        status: data.status
      };

      console.log('Sending update payload:', updatePayload);
      
      const response = await productApi.updateProduct(productId, updatePayload);
      
      if (response.status === 200) {
        toast({
          title: 'Thành công',
          description: 'Cập nhật sản phẩm thành công',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        await fetchProducts(); // Refresh list để hiển thị dữ liệu mới
      } else {
        throw new Error(response.message || 'Failed to update product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể cập nhật sản phẩm',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (productId: string) => {
    try {
      setLoading(true);
      
      const response = await productApi.deleteProduct(productId);
      console.log('Delete response:', response); // Debug log
      
      if (response.status === 200) {
        toast({
          title: 'Thành công',
          description: 'Xóa sản phẩm thành công',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        await fetchProducts(); // Refresh list after delete
      } else {
        throw new Error(response.message || 'Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể xóa sản phẩm. Vui lòng thử lại',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const getProductById = async (productId: string) => {
    try {
      const response = await productApi.getProductById(productId);
      if (response.status === 200) {
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Error getting product:', error);
      throw error;
    }
  };


  return {
    products,
    loading,
    selectedProduct,
    setSelectedProduct,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductById
  };
};
