import { useState, useEffect } from 'react';
import { useToast } from '@chakra-ui/react';
import { jwtDecode } from 'jwt-decode';
import { accountApi } from '@/apis/account.api';
import { ManagerData } from '@/utils/types/manager.types';

export const useAccountInfo = () => {
  const [managerData, setManagerData] = useState<ManagerData | null>(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const fetchManagerData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const decoded = jwtDecode(token) as any;
      const accountId = decoded.accountId;

      const response = await accountApi.getAccountById(accountId);
      if (response.status === 200) {
        setManagerData(response.data);
      }
    } catch (err) {
      toast({
        title: 'Lỗi',
        description: 'Không thể tải thông tin tài khoản',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const updateInfo = async (data: {
    email: string;
    avatarUrl: string;
    userName: string;
    fullName: string;
    phoneNumber: string;
  }) => {
    try {
      const token = localStorage.getItem('token');
      const decoded = jwtDecode(token!) as any;
      const accountId = decoded.accountId;

      const response = await accountApi.updateInfo(accountId, data);
      
      if (response.status === 200) {
        toast({
          title: 'Thành công',
          description: 'Cập nhật thông tin thành công',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        await fetchManagerData();
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      toast({
        title: 'Lỗi',
        description: 'Không thể cập nhật thông tin',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const updatePassword = async (data: {
    oldPassword: string;
    newPassword: string;
  }) => {
    try {
      const token = localStorage.getItem('token');
      const decoded = jwtDecode(token!) as any;
      const accountId = decoded.accountId;

      const response = await accountApi.updatePassword(accountId, data);
      
      if (response.status === 200) {
        toast({
          title: 'Thành công',
          description: 'Đổi mật khẩu thành công',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      toast({
        title: 'Lỗi',
        description: 'Không thể đổi mật khẩu',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    fetchManagerData();
  }, []);

  return {
    managerData,
    loading,
    updateInfo,
    updatePassword,
  };
};