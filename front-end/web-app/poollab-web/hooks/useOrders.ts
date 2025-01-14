import { useState, useCallback } from 'react';
import { useToast } from '@chakra-ui/react';
import { Order, OrderDetail } from '@/utils/types/order.types';
import { orderApi } from '@/apis/order.api';
import { jwtDecode } from 'jwt-decode';

export const useOrder = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    pageSize: 10
  });
  const toast = useToast();

  const fetchOrders = useCallback(async (pageNumber: number = 1, username: string = '') => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const decoded = jwtDecode(token) as { storeId: string };
      const response = await orderApi.getAllOrders({
        token,
        pageNumber,
        pageSize: pagination.pageSize,
        username
      });

      if (response.status === 200) {
        setOrders(response.data.items);
        setPagination({
          currentPage: response.data.pageNumber,
          totalPages: response.data.totalPages,
          totalItems: response.data.totalItem,
          pageSize: response.data.pageSize
        });
      }
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Không thể tải danh sách đơn hàng',
        status: 'error',
        duration: 3000,
      });
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [pagination.pageSize, toast]);


  const fetchOrderDetail = async (orderId: string) => {
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

  return {
    orders,
    selectedOrder,
    loading,
    detailLoading,
    pagination,
    fetchOrders,
    fetchOrderDetail,
  };
};