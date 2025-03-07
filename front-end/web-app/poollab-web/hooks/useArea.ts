import { useState, useCallback } from 'react';
import { useToast } from '@chakra-ui/react';
import { jwtDecode } from 'jwt-decode';
import { Area, JWTPayload } from '@/utils/types/area.types';
import { areaApi } from '@/apis/area.api';

export const useArea = () => {
  const [areas, setAreas] = useState<Area[]>([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const fetchAreas = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const decoded = jwtDecode(token) as JWTPayload;
      const storeId = decoded.storeId;

      const response = await areaApi.getAllAreas();

      if (response.status === 200) {
        const filteredAreas = (response.data as Area[]).filter(area => area.storeId === storeId);
        setAreas(filteredAreas);
      }
    } catch (err) {
      toast({
        title: 'Lỗi',
        description: 'Không thể tải danh sách khu vực',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      setAreas([]);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const createArea = async (data: Omit<Area, 'id'>) => {
    try {
      const response = await areaApi.createArea(data);
      if (response.status === 200) {
        toast({
          title: 'Thành công',
          description: 'Thêm khu vực mới thành công',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        await fetchAreas();
      }
    } catch (err) {
      toast({
        title: 'Lỗi',
        description: 'Không thể thêm khu vực mới',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      throw err;
    }
  };

  const updateArea = async (areaId: string, data: Partial<Area>) => {
    try {
      // Validate required fields
      if (!data.name?.trim()) {
        throw new Error('Tên khu vực là bắt buộc');
      }
      
      if (!data.storeId) {
        throw new Error('StoreId is required');
      }
  
      // Ensure all fields are properly formatted
      const updateData: Omit<Area, 'id'> = {
        name: data.name.trim(),
        descript: data.descript?.trim() ?? '',
        areaImg: data.areaImg ?? '',
        storeId: data.storeId
      };
  
      const response = await areaApi.updateArea(areaId, updateData);
      
      if (response.status === 200) {
        toast({
          title: 'Thành công',
          description: 'Cập nhật khu vực thành công',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        await fetchAreas(); // Refresh the list
      } else {
        throw new Error(response.message || 'Cập nhật thất bại');
      }
    } catch (err) {
      console.error('Update area error:', err);
      toast({
        title: 'Lỗi',
        description: err instanceof Error ? err.message : 'Không thể cập nhật khu vực',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      throw err;
    }
  };

  const deleteArea = async (areaId: string) => {
    try {
      const response = await areaApi.deleteArea(areaId);
      if (response.status === 200) {
        toast({
          title: 'Thành công',
          description: 'Xóa khu vực thành công',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        await fetchAreas();
      }
    } catch (err) {
      toast({
        title: 'Lỗi',
        description: 'Không thể xóa khu vực',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      throw err;
    }
  };

  return {
    areas,
    loading,
    fetchAreas,
    createArea,
    updateArea,
    deleteArea
  };
};