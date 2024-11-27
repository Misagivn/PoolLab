import { useState, useCallback } from 'react';
import { useToast } from '@chakra-ui/react';
import { BilliardType } from '@/utils/types/table.types';
import { billiardTypeApi } from '@/apis/billiard-type.api';

export const useBilliardType = () => {
  const [types, setTypes] = useState<BilliardType[]>([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const fetchTypes = useCallback(async () => {
    try {
      const response = await billiardTypeApi.getAllTypes();
      if (response.status === 200) {
        setTypes(Array.isArray(response.data) ? response.data : [response.data]);
      }
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Không thể tải danh sách loại bàn',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      setTypes([]);
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