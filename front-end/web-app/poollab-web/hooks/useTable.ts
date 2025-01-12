import { useState, useCallback } from 'react';
import { useToast } from '@chakra-ui/react';
import { jwtDecode } from 'jwt-decode';
import { BilliardTable } from '@/utils/types/table.types';
import { JWTPayload } from '@/utils/types/area.types';
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
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const decoded = jwtDecode(token) as JWTPayload;
      const response = await billiardTableApi.getAllTables(pageNumber, pagination.pageSize);

      if (response.status === 200) {
        // Lọc dữ liệu theo storeId từ token
        const filteredTables = response.data.items.filter(
          (table: BilliardTable) => table.storeId === decoded.storeId
        );

        setTables(filteredTables);
        setPagination({
          currentPage: response.data.pageNumber,
          totalPages: response.data.totalPages,
          totalItems: response.data.totalItem,
          pageSize: response.data.pageSize
        });
      } else {
        throw new Error(response.message || 'Failed to fetch tables');
      }
    } catch (error) {
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