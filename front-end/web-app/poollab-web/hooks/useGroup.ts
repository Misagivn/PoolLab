import { useState, useCallback } from 'react';
import { useToast } from '@chakra-ui/react';
import { ProductGroup } from '@/utils/types/group.types';
import { groupApi } from '@/apis/groupProduct.api';

export const useGroup = () => {
  const [groups, setGroups] = useState<ProductGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const fetchGroups = useCallback(async () => {
    try {
      setLoading(true);
      const response = await groupApi.getAllGroups();
      if (response.status === 200) {
        setGroups(response.data);
      }
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Không thể tải danh sách nhóm sản phẩm',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  return {
    groups,
    loading,
    fetchGroups
  };
};