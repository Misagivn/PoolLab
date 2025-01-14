import { useState, useCallback } from 'react';
import { useToast } from '@chakra-ui/react';
import { TableIssue } from '@/utils/types/tableIssues.types';
import { tableIssuesApi } from '@/apis/tableIssues.api';
import { jwtDecode } from 'jwt-decode';

interface MaintenanceFormData {
  tableIssuesId: string;
  technicianId: string;
  cost: number;
  startDate: string;
  endDate: string;
}

export const useTableIssues = () => {
  const [issues, setIssues] = useState<TableIssue[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIssue, setSelectedIssue] = useState<TableIssue | null>(null);
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

  const createMaintenance = async (data: MaintenanceFormData) => {
    try {
      const response = await tableIssuesApi.createMaintenance(data);
      
      if (response.status === 200) {
        toast({
          title: 'Thành công',
          description: 'Đã tạo lệnh bảo trì thành công',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        await fetchIssues(pagination.currentPage);
        return true;
      }
      throw new Error(response.message || 'Tạo lệnh bảo trì thất bại');
    } catch (err) {
      toast({
        title: 'Lỗi',
        description: err instanceof Error ? err.message : 'Không thể tạo lệnh bảo trì',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      throw err;
    }
  };

  const selectIssue = (issue: TableIssue | null) => {
    setSelectedIssue(issue);
  };

  return {
    issues,
    loading,
    selectedIssue,
    pagination,
    fetchIssues,
    createMaintenance,
    selectIssue,
  };
};