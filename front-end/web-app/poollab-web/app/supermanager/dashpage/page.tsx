"use client";

import {
  Box,
  Card,
  CardBody,
  Flex,
  Grid,
  Heading,
  Stack,
  Text,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Select,
  HStack,
  Spinner,
  Icon,
  Switch,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { FiShoppingBag, FiCalendar, FiDollarSign, FiUsers } from 'react-icons/fi';
import { useToast } from '@chakra-ui/react';
import { dashboardApi } from '@/apis/dashboardAdmin.api';

interface StoreRevenue {
  branchId: string;
  branchName: string;
  revenueByMonth: {
    month: number;
    orderRevenue: number;
    depositRevenue: number;
    totalRevenue: number;
  }[];
}

const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'];

export default function DashboardPage() {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [totalIncome, setTotalIncome] = useState("0");
  const [totalOrders, setTotalOrders] = useState("0");
  const [totalBookings, setTotalBookings] = useState("0");
  const [totalStaff, setTotalStaff] = useState("0");
  const [selectedYear, setSelectedYear] = useState(2024);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [showTotal, setShowTotal] = useState(true);
  const [chartData, setChartData] = useState<any[]>([]);
  const [storeRevenues, setStoreRevenues] = useState<StoreRevenue[]>([]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [
        incomeRes,
        ordersRes,
        bookingsRes,
        staffRes,
        storeRevenuesRes
      ] = await Promise.all([
        dashboardApi.getTotalIncome(),
        dashboardApi.getTotalOrders(),
        dashboardApi.getTotalBookings(),
        dashboardApi.getTotalStaff(),
        dashboardApi.getStoreRevenuesByYear(selectedYear)
      ]);

      if (incomeRes.status === 200) setTotalIncome(incomeRes.data);
      if (ordersRes.status === 200) setTotalOrders(ordersRes.data);
      if (bookingsRes.status === 200) setTotalBookings(bookingsRes.data);
      if (staffRes.status === 200) setTotalStaff(staffRes.data);

      if (storeRevenuesRes.status === 200) {
        setStoreRevenues(storeRevenuesRes.data);
        await updateChartData(storeRevenuesRes.data);
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

  const updateChartData = async (stores: StoreRevenue[]) => {
    try {
      if (selectedMonth !== null) {
        const promises = stores.map(store => 
          dashboardApi.getStoreIncomeByFilter(store.branchId, selectedYear, selectedMonth)
        );
        const monthlyData = await Promise.all(promises);

        // Transform data cho hiển thị theo ngày
        const transformedData = monthlyData[0].data.map((day: any) => {
          const dataPoint: any = {
            date: day.date,
            total: 0,
          };

          monthlyData.forEach((storeData, index) => {
            const storeName = stores[index].branchName;
            const dayData = storeData.data.find((d: any) => d.date === day.date);
            dataPoint[storeName] = dayData?.totalIncome || 0;
            dataPoint.total += dayData?.totalIncome || 0;
          });

          return dataPoint;
        });

        setChartData(transformedData);
      } else {
        // Transform data cho hiển thị cả năm
        const yearlyData = [{
          branchName: 'Doanh thu',
          total: stores.reduce((sum, store) => 
            sum + (store.revenueByMonth[0]?.totalRevenue || 0), 0
          ),
          ...stores.reduce((acc, store) => ({
            ...acc,
            [store.branchName]: store.revenueByMonth[0]?.totalRevenue || 0
          }), {})
        }];
        setChartData(yearlyData);
      }
    } catch (error) {
      console.error('Error updating chart data:', error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [selectedYear, selectedMonth]);

  const formatCurrency = (value: string | number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(Number(value));
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Card>
          <CardBody p={2}>
            <Text fontWeight="bold" mb={2}>{label}</Text>
            {payload.map((entry: any) => (
              <Text key={entry.name} color={entry.color}>
                {entry.name}: {formatCurrency(entry.value)}
              </Text>
            ))}
          </CardBody>
        </Card>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <Flex h="100vh" align="center" justify="center">
        <Spinner size="xl" color="blue.500" />
      </Flex>
    );
  }

  return (
    <Stack spacing={6} p={6}>
      {/* Stats Cards */}
      <Grid templateColumns="repeat(4, 1fr)" gap={6}>
        <Card bg="white" shadow="sm">
          <CardBody>
            <Stat>
              <Flex align="center">
                <Box p={3} bg="green.50" borderRadius="full" mr={4}>
                  <Icon as={FiDollarSign} boxSize={6} color="green.500" />
                </Box>
                <Box flex="1">
                  <StatLabel color="gray.500">Tổng doanh thu</StatLabel>
                  <StatNumber fontSize="2xl" color="green.500">
                    {formatCurrency(totalIncome)}
                  </StatNumber>
                  <StatHelpText mb={0}>
                    <StatArrow type="increase" />
                    6.0% so với kỳ trước
                  </StatHelpText>
                </Box>
              </Flex>
            </Stat>
          </CardBody>
        </Card>

        <Card bg="white" shadow="sm">
          <CardBody>
            <Stat>
              <Flex align="center">
                <Box p={3} bg="blue.50" borderRadius="full" mr={4}>
                  <Icon as={FiShoppingBag} boxSize={6} color="blue.500" />
                </Box>
                <Box flex="1">
                  <StatLabel color="gray.500">Tổng đơn hàng</StatLabel>
                  <StatNumber fontSize="2xl" color="blue.500">
                    {totalOrders}
                  </StatNumber>
                  <StatHelpText mb={0}>
                    <StatArrow type="increase" />
                    13.4% so với kỳ trước
                  </StatHelpText>
                </Box>
              </Flex>
            </Stat>
          </CardBody>
        </Card>

        <Card bg="white" shadow="sm">
          <CardBody>
            <Stat>
              <Flex align="center">
                <Box p={3} bg="purple.50" borderRadius="full" mr={4}>
                  <Icon as={FiCalendar} boxSize={6} color="purple.500" />
                </Box>
                <Box flex="1">
                  <StatLabel color="gray.500">Tổng booking</StatLabel>
                  <StatNumber fontSize="2xl" color="purple.500">
                    {totalBookings}
                  </StatNumber>
                  <StatHelpText mb={0}>
                    <StatArrow type="decrease" />
                    6.5% so với kỳ trước
                  </StatHelpText>
                </Box>
              </Flex>
            </Stat>
          </CardBody>
        </Card>

        <Card bg="white" shadow="sm">
          <CardBody>
            <Stat>
              <Flex align="center">
                <Box p={3} bg="orange.50" borderRadius="full" mr={4}>
                  <Icon as={FiUsers} boxSize={6} color="orange.500" />
                </Box>
                <Box flex="1">
                  <StatLabel color="gray.500">Tổng nhân viên</StatLabel>
                  <StatNumber fontSize="2xl" color="orange.500">
                    {totalStaff}
                  </StatNumber>
                  <StatHelpText mb={0}>
                    <StatArrow type="increase" />
                    8.2% so với kỳ trước
                  </StatHelpText>
                </Box>
              </Flex>
            </Stat>
          </CardBody>
        </Card>
      </Grid>

      {/* Revenue Chart */}
      <Card>
        <CardBody>
          <Flex justify="space-between" align="center" mb={6}>
            <Heading size="md">Biểu đồ doanh thu</Heading>
            <HStack spacing={4}>
              <Select 
                placeholder="Chọn tháng"
                value={selectedMonth || ''}
                onChange={(e) => setSelectedMonth(e.target.value ? Number(e.target.value) : null)}
                w="150px"
              >
                {Array.from({length: 12}, (_, i) => (
                  <option key={i + 1} value={i + 1}>Tháng {i + 1}</option>
                ))}
              </Select>

              <Select
                w="120px"
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
              >
                <option value={2024}>2024</option>
                <option value={2023}>2023</option>
              </Select>

              <FormControl display='flex' alignItems='center'>
                <FormLabel htmlFor='show-total' mb='0'>
                  Hiển thị tổng
                </FormLabel>
                <Switch 
                  id='show-total' 
                  isChecked={showTotal}
                  onChange={(e) => setShowTotal(e.target.checked)}
                />
              </FormControl>
            </HStack>
          </Flex>

          <Box h="400px">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={chartData}
                maxBarSize={60}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey={selectedMonth ? "date" : "branchName"}
                  interval={0}
                />
                <YAxis 
                  tickFormatter={(value) => 
                    new Intl.NumberFormat('vi-VN', {
                      notation: 'compact',
                      maximumFractionDigits: 1
                    }).format(value)
                  }
                />
                <Tooltip content={<CustomTooltip />} />
                {showTotal && (
                  <Bar dataKey="total" fill="#2D3748" name="Tổng" radius={[4, 4, 0, 0]} />
                )}
                {storeRevenues.map((store, index) => (
                  <Bar
                    key={store.branchId}
                    dataKey={store.branchName}
                    fill={colors[index % colors.length]}
                    name={store.branchName}
                    radius={[4, 4, 0, 0]}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </CardBody>
      </Card>

      {/* Revenue Details Table */}
      <Card>
        <CardBody>
          <Heading size="md" mb={4}>Chi tiết doanh thu theo cửa hàng</Heading>
          <Table>
            <Thead bg="gray.50">
              <Tr>
                <Th>CỬA HÀNG</Th>
                <Th isNumeric>DOANH THU</Th>
                <Th isNumeric>DOANH THU ĐƠN HÀNG</Th>
                <Th isNumeric>DOANH THU ĐẶT CỌC</Th>
              </Tr>
            </Thead>
            <Tbody>
              {storeRevenues.map((store) => (
                <Tr key={store.branchId}>
                  <Td fontWeight="medium">{store.branchName}</Td>
                  <Td isNumeric>{formatCurrency(store.revenueByMonth[0]?.totalRevenue || 0)}</Td>
                  <Td isNumeric>{formatCurrency(store.revenueByMonth[0]?.orderRevenue || 0)}</Td>
                  <Td isNumeric>{formatCurrency(store.revenueByMonth[0]?.depositRevenue || 0)}</Td>
                </Tr>
              ))}
              <Tr fontWeight="bold" bg="gray.50">
                <Td>Tổng cộng</Td>
                <Td isNumeric>
                  {formatCurrency(
                    storeRevenues.reduce(
                      (sum, store) => sum + (store.revenueByMonth[0]?.totalRevenue || 0),
                      0
                    )
                  )}
                </Td>
                <Td isNumeric>
                  {formatCurrency(
                    storeRevenues.reduce(
                      (sum, store) => sum + (store.revenueByMonth[0]?.orderRevenue || 0),
                      0
                    )
                  )}
                </Td>
                <Td isNumeric>
                  {formatCurrency(
                    storeRevenues.reduce(
                      (sum, store) => sum + (store.revenueByMonth[0]?.depositRevenue || 0),
                      0
                    )
                  )}
                </Td>
              </Tr>
            </Tbody>
          </Table>
        </CardBody>
      </Card>
    </Stack>
  );
}