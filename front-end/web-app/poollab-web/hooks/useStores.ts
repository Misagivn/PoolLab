
import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@chakra-ui/react';
import { Store } from '@/utils/types/store';
import { storeApi } from '@/apis/store.api';

export const useStores = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const fetchStores = useCallback(async () => {
    try {
      setLoading(true);
      const response = await storeApi.getAllStores();
      
      if (response.status === 200) {
        setStores(response.data as Store[]);
        return response.data;
      }
    } catch (err) {
      toast({
        title: 'Lỗi',
        description: 'Không thể tải danh sách cửa hàng',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      setStores([]);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const createStore = async (data: Omit<Store, 'id' | 'rated' | 'createdDate' | 'updatedDate' | 'status' | 'companyId'>) => {
    try {
      const response = await storeApi.createStore(data);
      if (response.status === 200) {
        toast({
          title: 'Thành công',
          description: 'Thêm cửa hàng mới thành công',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        await fetchStores();
        return response.data;
      }
    } catch (err) {
      toast({
        title: 'Lỗi',
        description: 'Không thể thêm cửa hàng mới',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      throw err;
    }
  };

  const updateStore = async (storeId: string, data: Omit<Store, 'id' | 'rated' | 'createdDate' | 'updatedDate' | 'status' | 'companyId'>) => {
    try {
      const response = await storeApi.updateStore(storeId, data);
      if (response.status === 200) {
        toast({
          title: 'Thành công',
          description: 'Cập nhật cửa hàng thành công',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        await fetchStores();
        return response.data;
      }
    } catch (err) {
      toast({
        title: 'Lỗi',
        description: 'Không thể cập nhật cửa hàng',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      throw err;
    }
  };
  
  const deleteStore = async (storeId: string) => {
    try {
      const response = await storeApi.deleteStore(storeId);
      if (response.status === 200) {
        toast({
          title: 'Thành công',
          description: 'Xóa cửa hàng thành công',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        await fetchStores();
      }
    } catch (err) {
      toast({
        title: 'Lỗi',
        description: 'Không thể xóa cửa hàng',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      throw err;
    }
  };

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  return {
    data: stores,
    loading,
    fetchStores,
    createStore,
    updateStore,
    deleteStore
  };
};