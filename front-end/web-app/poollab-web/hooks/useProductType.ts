import { useState, useCallback } from 'react';
import { useToast } from '@chakra-ui/react';
import { ProductType } from '@/utils/types/productType.types';
import { typeApi } from '@/apis/productType.api';

export const useType = () => {
  const [types, setTypes] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const fetchTypes = useCallback(async () => {
    try {
      setLoading(true);
      const response = await typeApi.getAllTypes();
      if (response.status === 200) {
        setTypes(response.data);
      }
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Không thể tải danh sách loại sản phẩm',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  return {
    types,
    loading,
    fetchTypes
  };
};
