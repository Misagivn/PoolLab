import { useState, useEffect } from 'react';
import { useToast } from '@chakra-ui/react';
import { dashboardApi } from '@/apis/dashboardAdmin.api';
import { useStores } from '@/hooks/useStores';

export const useDashboard = () => {
  const { data: stores } = useStores();
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalBookings, setTotalBookings] = useState(0);
  const [revenuesByStore, setRevenuesByStore] = useState<any[]>([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [incomeRes, ordersRes, bookingsRes, revenuesRes] = await Promise.all([
        dashboardApi.getTotalIncome(),
        dashboardApi.getTotalOrders(), 
        dashboardApi.getTotalBookings(),
        dashboardApi.getStoreRevenuesByYear(selectedYear)
      ]);

      if (incomeRes.status === 200) setTotalIncome(incomeRes.data);
      if (ordersRes.status === 200) setTotalOrders(ordersRes.data);
      if (bookingsRes.status === 200) setTotalBookings(bookingsRes.data);
      if (revenuesRes.status === 200) {
        // Transform data for chart
        const transformedData = revenuesRes.data.map((store: any) => ({
          id: store.branchId,
          name: store.branchName,
          revenue: store.revenueByMonth[0]?.totalRevenue || 0,
          orders: store.revenueByMonth[0]?.totalOrder || 0,
          avgOrder: store.revenueByMonth[0]?.totalRevenue / (store.revenueByMonth[0]?.totalOrder || 1)
        }));
        setRevenuesByStore(transformedData);
      }

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
  };

  useEffect(() => {
    fetchDashboardData();
  }, [selectedYear, selectedMonth]);

  return {
    totalIncome,
    totalOrders,
    totalBookings,
    revenuesByStore,
    selectedYear,
    setSelectedYear,
    selectedMonth,
    setSelectedMonth,
    loading,
    refetch: fetchDashboardData
  };
};