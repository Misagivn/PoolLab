import { useState, useCallback } from 'react';
import { useToast } from '@chakra-ui/react';
import { managerDashboardApi } from '@/apis/dashboardManager.api';
import { DailyStats } from '@/utils/types/dashboardMana.types';

export const useManagerDashboard = (storeId: string) => {
  const [loading, setLoading] = useState(true);
  const [income, setIncome] = useState('0');
  const [orders, setOrders] = useState('0');
  const [members, setMembers] = useState('0');
  const [reviews, setReviews] = useState('0');
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);
  const toast = useToast();

  const fetchDashboardData = useCallback(async (year: number, month: number) => {
    if (!storeId) return;
    
    try {
      setLoading(true);
      const [
        incomeRes, 
        ordersRes, 
        membersRes, 
        reviewsRes,
        dailyStatsRes
      ] = await Promise.all([
        managerDashboardApi.getStoreIncome(storeId),
        managerDashboardApi.getStoreOrders(storeId), 
        managerDashboardApi.getStoreMembers(storeId),
        managerDashboardApi.getStoreReviews(storeId),
        managerDashboardApi.getStoreDailyStats(storeId, year, month)
      ]);

      if (incomeRes.status === 200) setIncome(incomeRes.data);
      if (ordersRes.status === 200) setOrders(ordersRes.data);
      if (membersRes.status === 200) setMembers(membersRes.data);
      if (reviewsRes.status === 200) setReviews(reviewsRes.data);
      if (dailyStatsRes.status === 200) setDailyStats(dailyStatsRes.data);

    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Không thể tải dữ liệu dashboard',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }, [storeId, toast]);

  return {
    loading,
    income,
    orders,
    members,
    reviews,
    dailyStats,
    fetchDashboardData
  };
};
