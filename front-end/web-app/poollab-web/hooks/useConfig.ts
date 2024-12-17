import { useState, useCallback } from 'react';
import { useToast } from '@chakra-ui/react';
import { Config } from '@/utils/types/config.type';
import { configApi } from '@/apis/config.api';

export const useConfig = () => {
  const [config, setConfig] = useState<Config | null>(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const fetchConfig = useCallback(async () => {
    try {
      setLoading(true);
      const response = await configApi.getConfig();
      if (response.status === 200) {
        setConfig(response.data);
      }
    } catch (err) {
      toast({
        title: 'Lỗi',
        description: 'Không thể tải cấu hình',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const updateConfig = async (data: Omit<Config, 'id' | 'name' | 'createdDate' | 'updateDate' | 'status'>) => {
    try {
      setLoading(true);
      const response = await configApi.updateConfig(data);
      if (response.status === 200) {
        toast({
          title: 'Thành công',
          description: 'Cập nhật cấu hình thành công',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        await fetchConfig();
      }
    } catch (err) {
      toast({
        title: 'Lỗi',
        description: 'Không thể cập nhật cấu hình',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    config,
    loading,
    fetchConfig,
    updateConfig
  };
};