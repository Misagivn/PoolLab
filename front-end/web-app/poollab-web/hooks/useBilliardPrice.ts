import { useState, useCallback } from 'react';
import { useToast } from '@chakra-ui/react';
import { BilliardPrice } from '@/utils/types/table.types';
import { billiardPriceApi } from '@/apis/billiard-price.api';

export const useBilliardPrice = () => {
  const [prices, setPrices] = useState<BilliardPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const fetchPrices = useCallback(async () => {
    try {
      const response = await billiardPriceApi.getAllPrices();
      if (response.status === 200) {
        setPrices(Array.isArray(response.data) ? response.data : [response.data]);
      }
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Không thể tải danh sách giá',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      setPrices([]);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  return {
    prices,
    loading,
    fetchPrices
  };
};
