import { useState, useCallback } from 'react';
import { useToast } from '@chakra-ui/react';
import { TableIssue } from '@/utils/types/tableIssues.types';
import { tableIssuesApi } from '@/apis/tableIssues.api';
import { jwtDecode } from 'jwt-decode';

export const useTableIssues = () => {
  const [issues, setIssues] = useState<TableIssue[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    pageSize: 10
  });
  const toast = useToast();

  const fetchIssues = useCallback(async (pageNumber: number = 1) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const decoded = jwtDecode(token) as { storeId: string };
      const response = await tableIssuesApi.getAllTableIssues(decoded.storeId, pageNumber, pagination.pageSize);
      
      if (response.status === 200) {
        setIssues(response.data.items);
        setPagination(prev => ({
          ...prev,
          currentPage: pageNumber,
          totalPages: response.data.totalPages,
          totalItems: response.data.totalItem
        }));
      } else {
        throw new Error(response.message || 'Failed to fetch table issues');
      }
    } catch (error) {
      console.error('Error fetching table issues:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể tải danh sách sự cố',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      setIssues([]);
    } finally {
      setLoading(false);
    }
  }, [pagination.pageSize, toast]);

  return {
    issues,
    loading,
    pagination,
    fetchIssues
  };
};