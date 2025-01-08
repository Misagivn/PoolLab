import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@chakra-ui/react';
import { Transaction } from '@/utils/types/transaction.type';
import { OrderDetail } from '@/utils/types/order.types';
import { transactionApi } from '@/apis/transaction.api';
import { orderApi } from '@/apis/order.api';

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [orderCodes, setOrderCodes] = useState<Record<string, string>>({});
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

  const fetchOrderDetails = async (orderIds: string[]) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const uniqueOrderIds = [...new Set(orderIds)].filter(Boolean);
      const orderDetailsPromises = uniqueOrderIds.map(orderId => 
        orderApi.getOrderById(orderId, token)
      );

      const orders = await Promise.all(orderDetailsPromises);
      const newOrderCodes = orders.reduce((acc, order) => {
        if (order.status === 200 && order.data) {
          acc[order.data.id] = order.data.orderCode;
        }
        return acc;
      }, {} as Record<string, string>);

      setOrderCodes(prev => ({ ...prev, ...newOrderCodes }));
    } catch (error) {
      console.error('Error fetching order details:', error);
    }
  };

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
      const response = await transactionApi.getAllTransactions({
        pageNumber: page,
        pageSize: pagination.pageSize,
        username
      });
      
      if (response.status === 200) {
        const transactions = response.data.items;
        setTransactions(transactions);
        setPagination({
          totalItems: response.data.totalItem,
          pageSize: response.data.pageSize,
          totalPages: response.data.totalPages,
          currentPage: response.data.pageNumber
        });

        // Get orderIds from transactions
        const orderIds = transactions
          .map(t => t.orderId)
          .filter(Boolean) as string[];

        if (orderIds.length > 0) {
          await fetchOrderDetails(orderIds);
        }
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
      setLoading(false);
    }
  }, [pagination.pageSize, toast]);

  // Debounce search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchTransactions(1, searchUsername);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchUsername, fetchTransactions]);

  return {
    data: transactions,
    loading,
    pagination,
    searchUsername,
    setSearchUsername,
    fetchTransactions,
    orderCodes,
    selectedOrder,
    detailLoading,
    handleViewOrder
  };
};