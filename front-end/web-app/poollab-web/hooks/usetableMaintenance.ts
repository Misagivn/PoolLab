import { useState, useCallback } from 'react';
import { useToast } from '@chakra-ui/react';
import { tableMaintenanceApi } from '@/apis/tableMaintenance.api';
import { TableMaintenance, CreateMaintenanceRequest } from '@/utils/types/tableMaintenance.types';
import { jwtDecode } from 'jwt-decode';

export const useTableMaintenance = () => {
  const [maintenanceRecords, setMaintenanceRecords] = useState<TableMaintenance[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMaintenance, setSelectedMaintenance] = useState<TableMaintenance | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    pageSize: 10
  });
  const toast = useToast();

  const fetchMaintenance = useCallback(async (pageNumber: number = 1) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const decoded = jwtDecode(token) as { storeId: string };
      const response = await tableMaintenanceApi.getAllTableMaintenance(
        decoded.storeId,
        pageNumber,
        pagination.pageSize
      );

      if (response.status === 200) {
        setMaintenanceRecords(response.data.items);
        setPagination({
          currentPage: response.data.pageNumber,
          totalPages: response.data.totalPages,
          totalItems: response.data.totalItem,
          pageSize: response.data.pageSize
        });
      } else {
        throw new Error(response.message || 'Failed to fetch maintenance records');
      }
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Không thể tải danh sách bảo trì',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      setMaintenanceRecords([]);
    } finally {
      setLoading(false);
    }
  }, [pagination.pageSize, toast]);

  const createMaintenance = async (data: CreateMaintenanceRequest) => {
    try {
      const response = await tableMaintenanceApi.createMaintenance(data);
      
      if (response.status === 200) {
        toast({
          title: 'Thành công',
          description: 'Đã tạo lệnh bảo trì thành công',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        await fetchMaintenance(pagination.currentPage);
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

  const updateMaintenanceStatus = async (maintenanceId: string, status: string) => {
    try {
      const response = await tableMaintenanceApi.updateMaintenanceStatus(maintenanceId, status);
      
      if (response.status === 200) {
        toast({
          title: 'Thành công',
          description: 'Cập nhật trạng thái thành công',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        
        setMaintenanceRecords(prev => 
          prev.map(record => 
            record.id === maintenanceId 
              ? { ...record, status } 
              : record
          )
        );
        return true;
      }
      throw new Error(response.message || 'Cập nhật trạng thái thất bại');
    } catch (err) {
      toast({
        title: 'Lỗi',
        description: err instanceof Error ? err.message : 'Không thể cập nhật trạng thái',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      throw err;
    }
  };

  const selectMaintenance = (maintenance: TableMaintenance | null) => {
    setSelectedMaintenance(maintenance);
  };

  return {
    maintenanceRecords,
    loading,
    selectedMaintenance,
    pagination,
    fetchMaintenance,
    createMaintenance,
    updateMaintenanceStatus,
    selectMaintenance,
  };
};