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

  const fetchOrders = useCallback(async (page: number = 1) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const decoded = jwtDecode(token) as { storeId: string };
      const response = await orderApi.getAllOrders(token);

      if (response.status === 200) {
        // Lọc orders theo storeId
        const storeOrders = response.data.items.filter(
          order => order.storeId === decoded.storeId
        );

        // Tính toán phân trang
        const totalItems = storeOrders.length;
        const totalPages = Math.ceil(totalItems / pagination.pageSize);
        const startIndex = (page - 1) * pagination.pageSize;
        const endIndex = startIndex + pagination.pageSize;
        
        // Lấy orders cho trang hiện tại
        const paginatedOrders = storeOrders.slice(startIndex, endIndex);

        // Cập nhật state
        setOrders(paginatedOrders);
        setPagination({
          currentPage: page,
          totalPages,
          totalItems,
          pageSize: pagination.pageSize
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
  }, [toast, pagination.pageSize]);

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

  const changePage = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchOrders(newPage);
    }
  };

  const resetPagination = () => {
    setPagination({
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      pageSize: 10
    });
    fetchOrders(1);
  };

  return {
    orders,
    selectedOrder,
    loading,
    detailLoading,
    pagination,
    fetchOrders,
    fetchOrderDetail,
    changePage,
    resetPagination
  };
};