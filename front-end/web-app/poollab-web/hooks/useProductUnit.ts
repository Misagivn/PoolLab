import { useState, useCallback } from 'react';
import { useToast } from '@chakra-ui/react';
import { Unit } from '@/utils/types/productUnit.types';
import { unitApi } from '@/apis/productUnit.api';

export const useUnit = () => {
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const fetchUnits = useCallback(async () => {
    try {
      setLoading(true);
      const response = await unitApi.getAllUnits();
      if (response.status === 200) {
        setUnits(response.data);
      }
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Không thể tải danh sách đơn vị tính',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  return {
    units,
    loading,
    fetchUnits
  };
};