import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@chakra-ui/react';
import { jwtDecode } from 'jwt-decode';
import { Staff as Manager, JWTPayload, StaffFormData as ManagerFormData, UpdateStaffRequest as UpdateManagerRequest } from '@/utils/types/staff.types';
import { staffApi } from '@/apis/staff.api';

const MANAGER_ROLE_ID = '895efd38-7cb6-47f7-a02d-3e9dbfe1a803';

export const useManagers = () => {
 const [managers, setManagers] = useState<Manager[]>([]);
 const [loading, setLoading] = useState(true);
 const [selectedManager, setSelectedManager] = useState<Manager | null>(null);
 const [pagination, setPagination] = useState({
   currentPage: 1,
   totalPages: 1,
   totalItems: 0,
   pageSize: 10
 });
 const toast = useToast();

 const fetchManagers = useCallback(async (pageNumber: number = 1) => {
   try {
     setLoading(true);
     const token = localStorage.getItem('token');
     if (!token) throw new Error('No token found');

     const decoded = jwtDecode(token) as JWTPayload;
     const response = await staffApi.getAllStaff({
       pageNumber,
       pageSize: pagination.pageSize,
       roleId: MANAGER_ROLE_ID
     });

     if (response.status === 200) {
       setManagers(response.data.items);
       setPagination({
         currentPage: response.data.pageNumber,
         totalPages: response.data.totalPages,
         totalItems: response.data.totalItem,
         pageSize: response.data.pageSize
       });
     } else {
       throw new Error(response.message || 'Failed to fetch managers');
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
 }, [toast, pagination.pageSize]);

 const createManager = async (data: ManagerFormData) => {
   try {
     const token = localStorage.getItem('token');
     if (!token) throw new Error('No token found');

     const decoded = jwtDecode(token) as JWTPayload;
     const response = await staffApi.createStaff({
       ...data,
       roleName: 'Manager',
       storeId: decoded.storeId,
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

 const updateManager = async (managerId: string, data: UpdateManagerRequest) => {
   try {
     const response = await staffApi.updateStaff(managerId, data);
     
     if (response.status === 200) {
       // Update local state immediately
       setManagers(prevManagers => 
         prevManagers.map(m => 
           m.id === managerId 
             ? { 
                 ...m,
                 email: data.email,
                 userName: data.userName,
                 fullName: data.fullName,
                 phoneNumber: data.phoneNumber,
                 avatarUrl: data.avatarUrl || m.avatarUrl
               } 
             : m
         )
       );

       toast({
         title: 'Thành công',
         description: 'Cập nhật thông tin quản lý thành công',
         status: 'success',
         duration: 3000,
         isClosable: true,
       });

       // Fetch fresh data in background
       fetchManagers(pagination.currentPage);
       return true;
     }
     throw new Error(response.message || 'Cập nhật thông tin thất bại');
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

 const selectManager = (manager: Manager | null) => {
   setSelectedManager(manager);
 };

 const getWorkingStatus = (status: string) => {
   return status === 'Kích hoạt' ? 'Đang làm việc' : 'Đã nghỉ việc';
 };

 return {
   managers,
   loading,
   selectedManager,
   pagination,
   fetchManagers,
   createManager,
   updateManager,
   uploadAvatar,
   selectManager,
   getWorkingStatus
 };
};