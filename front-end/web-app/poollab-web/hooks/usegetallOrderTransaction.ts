import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@chakra-ui/react';
import { OrderTransaction } from '@/utils/types/transaction.type';
import { OrderDetail } from '@/utils/types/order.types';
import { transactionApi } from '@/apis/transaction.api';
import { orderApi } from '@/apis/order.api';

export const useOrderTransactions = () => {
  const [transactions, setTransactions] = useState<OrderTransaction[]>([]);
  const [searchUsername, setSearchUsername] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<OrderDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [pagination, setPagination] = useState({
    totalItems: 0,
    pageSize: 10,
    totalPages: 1,
    currentPage: 1
  });
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const handleViewOrder = async (orderId: string) => {
    try {
      setDetailLoading(true);
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const response = await orderApi.getOrderById(orderId, token);
      if (response.status === 200) {
        setSelectedOrder(response.data);
      }
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Không thể tải chi tiết đơn hàng',
        status: 'error',
        duration: 3000,
      });
      setSelectedOrder(null);
    } finally {
      setDetailLoading(false);
    }
  };

  const fetchTransactions = useCallback(async (page: number = 1, username: string = '') => {
    try {
      setLoading(true);
      const response = await transactionApi.getAllOrderTransactions({
        pageNumber: page,
        pageSize: pagination.pageSize,
        username
      });
      
      if (response.status === 200) {
        setTransactions(response.data.items);
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
        description: 'Không thể tải danh sách giao dịch đơn hàng',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  }, [pagination.pageSize, toast]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchTransactions(1, searchUsername);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchUsername, fetchTransactions]);

  return {
    transactions,
    loading,
    pagination,
    searchUsername,
    setSearchUsername,
    fetchTransactions,
    selectedOrder,
    detailLoading,
    handleViewOrder
  };
};