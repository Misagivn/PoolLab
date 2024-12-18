import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@chakra-ui/react';
import { Voucher } from '@/utils/types/voucher.types';
import { voucherApi } from '@/apis/voucher.api';

export const useVouchers = () => {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [pagination, setPagination] = useState({
    totalItems: 0,
    pageSize: 10,
    totalPages: 1,
    currentPage: 1
  });
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const fetchVouchers = useCallback(async (page: number = 1) => {
    try {
      setLoading(true);
      const response = await voucherApi.getAllVouchers(page);
      
      if (response.status === 200) {
        setVouchers(response.data.items);
        setPagination({
          totalItems: response.data.totalItem,
          pageSize: response.data.pageSize,
          totalPages: response.data.totalPages,
          currentPage: response.data.pageNumber
        });
      }
    } catch (err) {
      toast({
        title: 'Lỗi',
        description: 'Không thể tải danh sách voucher',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      setVouchers([]);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const createVoucher = async (data: Pick<Voucher, 'name' | 'description' | 'point' | 'discount'>) => {
    try {
      const response = await voucherApi.createVoucher(data);
      if (response.status === 200) {
        toast({
          title: 'Thành công',
          description: 'Thêm voucher mới thành công',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        await fetchVouchers();
        return response.data;
      }
    } catch (err) {
      toast({
        title: 'Lỗi',
        description: 'Không thể thêm voucher mới',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      throw err;
    }
  };

  const updateVoucher = async (voucherId: string, data: Pick<Voucher, 'name' | 'description' | 'point' | 'discount'>) => {
    try {
      const response = await voucherApi.updateVoucher(voucherId, data);
      if (response.status === 200) {
        toast({
          title: 'Thành công',
          description: 'Cập nhật voucher thành công',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        await fetchVouchers();
        return response.data;
      }
    } catch (err) {
      toast({
        title: 'Lỗi',
        description: 'Không thể cập nhật voucher',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      throw err;
    }
  };

  const inactiveVoucher = async (voucherId: string) => {
    try {
      const response = await voucherApi.inactiveVoucher(voucherId);
      if (response.status === 200) {
        toast({
          title: 'Thành công',
          description: 'Vô hiệu hóa voucher thành công',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        await fetchVouchers();
      }
    } catch (err) {
      toast({
        title: 'Lỗi',
        description: 'Không thể vô hiệu hóa voucher',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      throw err;
    }
  };

  const reactivateVoucher = async (voucherId: string) => {
    try {
      const response = await voucherApi.reactivateVoucher(voucherId);
      if (response.status === 200) {
        toast({
          title: 'Thành công',
          description: 'Kích hoạt lại voucher thành công',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        await fetchVouchers();
      }
    } catch (err) {
      toast({
        title: 'Lỗi',
        description: 'Không thể kích hoạt lại voucher',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      throw err;
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, [fetchVouchers]);

  return {
    data: vouchers,
    loading,
    pagination,
    fetchVouchers,
    createVoucher,
    updateVoucher,
    inactiveVoucher,
    reactivateVoucher
  };
};