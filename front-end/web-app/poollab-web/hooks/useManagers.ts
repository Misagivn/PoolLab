import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@chakra-ui/react';
import { Manager, ManagerFormData } from '@/utils/types/manager.type';
import { Store } from '@/utils/types/store';
import { staffApi } from '@/apis/staff.api';
import { storeApi } from '@/apis/store.api';
import { jwtDecode } from 'jwt-decode';

const MANAGER_ROLE_ID = '895efd38-7cb6-47f7-a02d-3e9dbfe1a803';

export const useManagers = () => {
  const [managers, setManagers] = useState<Manager[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedManager, setSelectedManager] = useState<Manager | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    pageSize: 10
  });
  const toast = useToast();

  const fetchStores = useCallback(async () => {
    try {
      const response = await storeApi.getAllStores();
      if (response.status === 200) {
        setStores(response.data.items);
      }
    } catch (err) {
      toast({
        title: 'Lỗi',
        description: 'Không thể tải danh sách cửa hàng',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  }, [toast]);

  const fetchManagers = useCallback(async (pageNumber: number = 1) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const response = await staffApi.getAllStaff({
        pageNumber,
        pageSize: pagination.pageSize,
        roleId: MANAGER_ROLE_ID,
        SortBy: 'joinDate',
        SortAscending: false
      });

      if (response.status === 200) {
        setManagers(response.data.items);
        setPagination({
          currentPage: response.data.pageNumber,
          totalPages: response.data.totalPages,
          totalItems: response.data.totalItem,
          pageSize: response.data.pageSize
        });
      }
    } catch (err) {
      toast({
        title: 'Lỗi',
        description: 'Không thể tải danh sách quản lý',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      setManagers([]);
    } finally {
      setLoading(false);
    }
  }, [pagination.pageSize, toast]);

  const createManager = async (data: ManagerFormData) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const response = await staffApi.createStaff({
        ...data,
        roleName: 'Manager',
        storeId: data.storeId,
        companyId: null
      });

      if (response.status === 200) {
        toast({
          title: 'Thành công',
          description: 'Thêm quản lý mới thành công',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        await fetchManagers(pagination.currentPage);
        return true;
      }
      throw new Error(response.message || 'Thêm quản lý thất bại');
    } catch (err) {
      toast({
        title: 'Lỗi',
        description: err instanceof Error ? err.message : 'Không thể thêm quản lý mới',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      throw err;
    }
  };

  const updateManager = async (managerId: string, data: Partial<Manager>) => {
    try {
      const response = await staffApi.updateStaff(managerId, data);
      if (response.status === 200) {
        setManagers(prev => prev.map(m => 
          m.id === managerId ? { ...m, ...data } : m
        ));
        toast({
          title: 'Thành công',
          description: 'Cập nhật thông tin quản lý thành công',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        fetchManagers(pagination.currentPage);
        return true;
      }
      throw new Error(response.message || 'Cập nhật thất bại');
    } catch (err) {
      toast({
        title: 'Lỗi',
        description: err instanceof Error ? err.message : 'Không thể cập nhật thông tin quản lý',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      throw err;
    }
  };

  const updateManagerStatus = async (managerId: string, status: string) => {
    try {
      setLoading(true);
      const response = await staffApi.updateAccountStatus(managerId, status);
      
      if (response.status === 200) {
        toast({
          title: 'Thành công',
          description: 'Cập nhật trạng thái thành công',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        setManagers(prev => prev.map(manager => 
          manager.id === managerId 
            ? { ...manager, status } 
            : manager
        ));
      }
    } catch (err) {
      toast({
        title: 'Lỗi',
        description: 'Không thể cập nhật trạng thái',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
    fetchManagers(1);
  }, [fetchStores, fetchManagers]);

  return {
    data: managers,
    stores,
    loading,
    selectedManager,
    pagination,
    fetchManagers,
    createManager,
    updateManager,
    updateManagerStatus,
    selectManager: setSelectedManager
  };
};