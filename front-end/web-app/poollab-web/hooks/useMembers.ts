import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@chakra-ui/react';
import { Staff as Member } from '@/utils/types/staff.types';
import { staffApi } from '@/apis/staff.api';
import { jwtDecode } from 'jwt-decode';

const MEMBER_ROLE_ID = 'eaac3552-6ca6-4d63-b474-c05da69f845f';

export const useMembers = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    pageSize: 10
  });
  const toast = useToast();

  const updateMemberStatus = async (memberId: string, status: string) => {
    try {
      setLoading(true);
      const response = await staffApi.updateAccountStatus(memberId, status);
      
      if (response.status === 200) {
        toast({
          title: 'Thành công',
          description: 'Cập nhật trạng thái thành công',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        setMembers(members.map(member => 
          member.id === memberId 
            ? { ...member, status } 
            : member
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

  const getMemberStatus = (status: string) => {
    switch (status) {
      case 'Kích Hoạt':
        return 'Đang hoạt động';
      case 'Vô Hiệu':
        return 'Đã khóa';
      default:
        return status;
    }
  };

  const fetchMembers = useCallback(async (page: number = 1) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const decoded = jwtDecode(token) as { storeId: string };
      const response = await staffApi.getAllStaff({
        pageNumber: page,
        pageSize: pagination.pageSize,
        roleId: MEMBER_ROLE_ID,
        storeId: decoded.storeId,
        UserName: searchQuery || undefined,
        SortBy: 'joinDate',
        SortAscending: false
      });

      if (response.status === 200) {
        setMembers(response.data.items);
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
        description: 'Không thể tải danh sách thành viên',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      setMembers([]);
    } finally {
      setLoading(false);
    }
  }, [pagination.pageSize, searchQuery, toast]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchMembers(1);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, fetchMembers]);

  useEffect(() => {
    fetchMembers(1);
  }, [fetchMembers]);

 

  return {
    data: members,
    loading,
    searchQuery,
    setSearchQuery,
    selectedMember,
    pagination,
    fetchMembers,
    selectMember: setSelectedMember,
    updateMemberStatus,
    getMemberStatus
  };
};
