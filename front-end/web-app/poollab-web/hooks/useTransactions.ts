import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@chakra-ui/react';
import { Transaction, OrderTransaction } from '@/utils/types/transaction.type';
import { OrderDetail } from '@/utils/types/order.types';
import { transactionApi } from '@/apis/transaction.api';
import { orderApi } from '@/apis/order.api';

export const useTransactions = () => {
  // General transactions state
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [transactionPagination, setTransactionPagination] = useState({
    totalItems: 0,
    pageSize: 10,
    totalPages: 1,
    currentPage: 1
  });
  const [transactionLoading, setTransactionLoading] = useState(true);

  // Order transactions state
  const [orderTransactions, setOrderTransactions] = useState<OrderTransaction[]>([]);
  const [orderPagination, setOrderPagination] = useState({
    totalItems: 0,
    pageSize: 10,
    totalPages: 1,
    currentPage: 1
  });
  const [orderLoading, setOrderLoading] = useState(true);

  // Common state
  const [searchUsername, setSearchUsername] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<OrderDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
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

  const fetchAllTransactions = useCallback(async (page: number = 1, username: string = '') => {
    try {
      setTransactionLoading(true);
      const response = await transactionApi.getAllTransactions({
        pageNumber: page,
        pageSize: transactionPagination.pageSize,
        username
      });
      
      if (response.status === 200) {
        setTransactions(response.data.items);
        setTransactionPagination({
          totalItems: response.data.totalItem,
          pageSize: response.data.pageSize,
          totalPages: response.data.totalPages,
          currentPage: response.data.pageNumber
        });
      }
    } catch (err) {
      toast({
        title: 'Lỗi',
        description: 'Không thể tải danh sách giao dịch',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      setTransactions([]);
    } finally {
      setTransactionLoading(false);
    }
  }, [transactionPagination.pageSize, toast]);

  const fetchOrderTransactions = useCallback(async (page: number = 1, username: string = '') => {
    try {
      setOrderLoading(true);
      const response = await transactionApi.getAllOrderTransactions({
        pageNumber: page,
        pageSize: orderPagination.pageSize,
        username
      });
      
      if (response.status === 200) {
        setOrderTransactions(response.data.items);
        setOrderPagination({
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
      setOrderTransactions([]);
    } finally {
      setOrderLoading(false);
    }
  }, [orderPagination.pageSize, toast]);

  // Fetch both types of transactions when search changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchAllTransactions(1, searchUsername);
      fetchOrderTransactions(1, searchUsername);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchUsername, fetchAllTransactions, fetchOrderTransactions]);

  return {
    // General transactions
    transactions,
    transactionPagination,
    transactionLoading,
    fetchAllTransactions,

    // Order transactions
    orderTransactions,
    orderPagination,
    orderLoading,
    fetchOrderTransactions,

    // Common
    searchUsername,
    setSearchUsername,
    selectedOrder,
    detailLoading,
    handleViewOrder,
  };
};