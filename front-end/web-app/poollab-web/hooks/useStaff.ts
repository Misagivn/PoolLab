import { useState, useCallback } from 'react';
import { useToast } from '@chakra-ui/react';
import { jwtDecode } from 'jwt-decode';
import { Staff, JWTPayload, StaffFormData, UpdateStaffRequest } from '@/utils/types/staff.types';
import { staffApi } from '@/apis/staff.api';

export const useStaff = () => {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    pageSize: 10
  });
  const toast = useToast();

  const fetchStaff = useCallback(async (pageNumber: number = 1) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const decoded = jwtDecode(token) as JWTPayload;
      const response = await staffApi.getAllStaff({
        pageNumber,
        pageSize: pagination.pageSize,
        storeId: decoded.storeId
      });

      if (response.status === 200) {
        setStaff(response.data.items);
        setPagination({
          currentPage: response.data.pageNumber,
          totalPages: response.data.totalPages,
          totalItems: response.data.totalItem,
          pageSize: response.data.pageSize
        });
      } else {
        throw new Error(response.message || 'Failed to fetch staff');
      }
    } catch (err) {
      toast({
        title: 'Lỗi',
        description: 'Không thể tải danh sách nhân viên',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      setStaff([]);
    } finally {
      setLoading(false);
    }
  }, [toast, pagination.pageSize]);

  const createStaff = async (data: StaffFormData) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const decoded = jwtDecode(token) as JWTPayload;
      const response = await staffApi.createStaff({
        ...data,
        roleName: 'Staff',
        storeId: decoded.storeId,
        companyId: null
      });

      if (response.status === 200) {
        toast({
          title: 'Thành công',
          description: 'Thêm nhân viên mới thành công',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        await fetchStaff(pagination.currentPage);
        return true;
      }
      throw new Error(response.message || 'Thêm nhân viên thất bại');
    } catch (err) {
      toast({
        title: 'Lỗi',
        description: err instanceof Error ? err.message : 'Không thể thêm nhân viên mới',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      throw err;
    }
  };

  const uploadAvatar = async (file: File): Promise<string> => {
    try {
      const response = await staffApi.uploadAvatar(file);
      if (response.status === 200) {
        return response.data as string;
      }
      throw new Error('Upload avatar failed');
    } catch (err) {
      toast({
        title: 'Lỗi',
        description: 'Không thể tải ảnh đại diện lên',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      throw err;
    }
  };

  const updateStaff = async (staffId: string, data: UpdateStaffRequest) => {
    try {
      const response = await staffApi.updateStaff(staffId, data);
      
      if (response.status === 200) {
        // Update local state immediately
        setStaff(prevStaff => 
          prevStaff.map(s => 
            s.id === staffId 
              ? { 
                  ...s,
                  email: data.email,
                  userName: data.userName,
                  fullName: data.fullName,
                  phoneNumber: data.phoneNumber,
                  avatarUrl: data.avatarUrl || s.avatarUrl
                } 
              : s
          )
        );

        toast({
          title: 'Thành công',
          description: 'Cập nhật thông tin nhân viên thành công',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });

        // Fetch fresh data in background
        fetchStaff(pagination.currentPage);
        return true;
      }
      throw new Error(response.message || 'Cập nhật thông tin thất bại');
    } catch (err) {
      toast({
        title: 'Lỗi',
        description: err instanceof Error ? err.message : 'Không thể cập nhật thông tin nhân viên',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      throw err;
    }
  };

  const selectStaff = (staff: Staff | null) => {
    setSelectedStaff(staff);
  };


  const updateStaffStatus = async (staffId: string, status: string) => {
    try {
      setLoading(true);
      const response = await staffApi.updateAccountStatus(staffId, status);
      
      if (response.status === 200) {
        toast({
          title: 'Thành công',
          description: 'Cập nhật trạng thái thành công',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        setStaff(prev => prev.map(staff => 
          staff.id === staffId 
            ? { ...staff, status } 
            : staff
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

  return {
    staff,
    loading,
    selectedStaff,
    pagination,
    fetchStaff,
    createStaff,
    updateStaff,
    updateStaffStatus,
    uploadAvatar,
    selectStaff,
  };
};