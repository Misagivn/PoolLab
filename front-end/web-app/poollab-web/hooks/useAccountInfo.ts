import { useState, useEffect } from 'react';
import { useToast } from '@chakra-ui/react';
import { jwtDecode } from 'jwt-decode';
import { accountApi } from '@/apis/account.api';
import { ManagerData } from '@/utils/types/manager.types';

export const useAccountInfo = () => {
  const [managerData, setManagerData] = useState<ManagerData | null>(null);
  const [roleName, setRoleName] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const toast = useToast();

  const fetchRoleName = async (roleId: string) => {
    try {
      const response = await accountApi.getAllRoles();
      if (response.status === 200) {
        const role = response.data.find((role: any) => role.id === roleId);
        if (role) {
          setRoleName(role.name);
        }
      }
    } catch (err) {
      console.error('Error fetching role:', err);
    }
  };
  const fetchManagerData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const decoded = jwtDecode(token) as any;
      const accountId = decoded.accountId;

      const response = await accountApi.getAccountById(accountId);
      if (response.status === 200) {
        setManagerData(response.data);
        if (response.data.roleId) {
          await fetchRoleName(response.data.roleId);
        }
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

  const uploadAvatar = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn file hình ảnh",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return null;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Lỗi",
        description: "Kích thước file không được vượt quá 5MB",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return null;
    }

    setIsUploading(true);
    try {
      const response = await accountApi.uploadAvatar(file);
      
      if (response.status === 200) {
        toast({
          title: "Thành công",
          description: "Cập nhật ảnh đại diện thành công",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        
        if (managerData) {
          await updateInfo({
            ...managerData,
            avatarUrl: response.data
          });
        }
        return response.data;
      } else {
        throw new Error(response.message || 'Upload failed');
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể tải lên ảnh đại diện",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    fetchManagerData();
  }, []);

  return {
    managerData,
    roleName,
    loading,
    isUploading,
    updateInfo,
    updatePassword,
    uploadAvatar,
  };
};