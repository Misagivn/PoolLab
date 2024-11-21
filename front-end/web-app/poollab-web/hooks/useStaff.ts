import { useState, useCallback } from 'react';
import { useToast } from '@chakra-ui/react';
import { jwtDecode } from 'jwt-decode';
import { Staff, JWTPayload, StaffFormData } from '@/utils/types/staff.types';
import { staffApi } from '@/apis/staff.api';

export const useStaff = () => {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const fetchStaff = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const decoded = jwtDecode(token) as JWTPayload;
      const response = await staffApi.getAllStaff(decoded.storeId);

      if (response.status === 200) {
        setStaff(response.data.items);
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
  }, [toast]);

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
        await fetchStaff();
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

  return {
    staff,
    loading,
    fetchStaff,
    createStaff,
    uploadAvatar
  };
};