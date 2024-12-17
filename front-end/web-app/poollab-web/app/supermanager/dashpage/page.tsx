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
  Switch,
  FormControl,
  FormLabel,
  Spinner,
} from '@chakra-ui/react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useDashboard } from '@/hooks/useDashboardAdmin';

export default function DashboardPage() {
  const {
    totalIncome,
    totalOrders,
    totalBookings,
    revenuesByStore,
    selectedYear,
    setSelectedYear,
    selectedMonth,
    setSelectedMonth,
    loading
  } = useDashboard();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  if (loading) {
    return (
      <Flex h="100%" align="center" justify="center" p={6}>
        <Spinner size="xl" color="blue.500" />
      </Flex>
    );
  }

  return (
    <Stack spacing={6}>
      {/* Stats Overview */}
      <Grid templateColumns="repeat(3, 1fr)" gap={6}>
        <Card>
          <CardBody>
            <Stat>
              <StatLabel fontSize="lg">Tổng doanh thu</StatLabel>
              <StatNumber fontSize="2xl" color="green.500">
                {formatCurrency(totalIncome)}
              </StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
                6.0% so với kỳ trước
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Stat>
              <StatLabel fontSize="lg">Tổng đơn hàng</StatLabel>
              <StatNumber fontSize="2xl" color="blue.500">
                {totalOrders}
              </StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
                13.4% so với kỳ trước
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Stat>
              <StatLabel fontSize="lg">Giá trị đơn trung bình</StatLabel>
              <StatNumber fontSize="2xl" color="purple.500">
                {formatCurrency(totalIncome / totalOrders)}
              </StatNumber>
              <StatHelpText>
                <StatArrow type="decrease" />
                6.5% so với kỳ trước
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>
      </Grid>

      {/* Revenue Chart */}
      <Card>
        <CardBody>
          <Flex justifyContent="space-between" alignItems="center" mb={4}>
            <Heading size="md">Biểu đồ doanh thu</Heading>
            <HStack spacing={4}>
              <Select
                size="sm"
                width="150px"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
              >
                {Array.from({length: 12}, (_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1} tháng</option>
                ))}
              </Select>

              <Select
                size="sm"
                width="150px"
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
              >
                <option value={2024}>2024</option>
                <option value={2023}>2023</option>
              </Select>

              <FormControl display="flex" alignItems="center">
                <FormLabel mb="0" mr={2}>
                  Hiển thị tất cả
                </FormLabel>
                <Switch colorScheme="blue" />
              </FormControl>
            </HStack>
          </Flex>

          <Box height="400px">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenuesByStore}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="revenue" name="Doanh thu" fill="#82ca9d" />
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
            <Thead>
              <Tr>
                <Th>CỬA HÀNG</Th>
                <Th isNumeric>DOANH THU</Th>
                <Th isNumeric>SỐ ĐƠN</Th>
                <Th isNumeric>TB/ĐƠN</Th>
              </Tr>
            </Thead>
            <Tbody>
              {revenuesByStore.map((store) => (
                <Tr key={store.id}>
                  <Td>{store.name}</Td>
                  <Td isNumeric>{formatCurrency(store.revenue)}</Td>
                  <Td isNumeric>{store.orders}</Td>
                  <Td isNumeric>{formatCurrency(store.avgOrder)}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </CardBody>
      </Card>
    </Stack>
  );
}