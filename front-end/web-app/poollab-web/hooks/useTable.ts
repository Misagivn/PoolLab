import { useState, useCallback } from 'react';
import { useToast } from '@chakra-ui/react';
import { BilliardTable } from '@/utils/types/table.types';
import { billiardTableApi } from '@/apis/table.api';

export const useBilliardTable = () => {
  const [tables, setTables] = useState<BilliardTable[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    pageSize: 10
  });
  const toast = useToast();

  const fetchTables = useCallback(async (pageNumber: number = 1) => {
    try {
      setLoading(true);
      const response = await billiardTableApi.getAllTables(pageNumber, pagination.pageSize);
      
      if (response.status === 200) {
        setTables(response.data.items);
        setPagination(prev => ({
          ...prev,
          currentPage: pageNumber,
          totalPages: response.data.totalPages,
          totalItems: response.data.totalItem
        }));
      } else {
        throw new Error(response.message || 'Failed to fetch tables');
      }
    } catch (error) {
      console.error('Error fetching tables:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể tải danh sách bàn',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      setTables([]);
    } finally {
      setLoading(false);
    }
  }, [pagination.pageSize, toast]);

  return {
    tables,
    loading,
    pagination,
    fetchTables
  };
};