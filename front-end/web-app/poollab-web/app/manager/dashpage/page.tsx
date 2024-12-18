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
  Select,
  HStack,
  Spinner,
  Icon,
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
import { FiDollarSign, FiShoppingBag, FiUsers, FiStar } from 'react-icons/fi';
import { useManagerDashboard } from '@/hooks/useDashBoardMana';

export default function ManagerDashboard() {
  // Replace with actual store ID
  const storeId = '8a78e8ab-2e80-4042-bf08-e205672f5464';
  const [selectedYear, setSelectedYear] = useState(2024);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  const {
    loading,
    income,
    orders,
    members,
    reviews,
    dailyStats,
    fetchDashboardData
  } = useManagerDashboard(storeId);

  useEffect(() => {
    fetchDashboardData(selectedYear, selectedMonth);
  }, [selectedYear, selectedMonth, fetchDashboardData]);

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
                {entry.name}: {
                  entry.dataKey === 'totalIncome' 
                    ? formatCurrency(entry.value)
                    : entry.value
                }
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
      {/* Stats Overview */}
      <Grid templateColumns="repeat(4, 1fr)" gap={6}>
        <Card bg="white" shadow="sm">
          <CardBody>
            <Stat>
              <Flex align="center">
                <Box p={3} bg="green.50" borderRadius="full" mr={4}>
                  <Icon as={FiDollarSign} boxSize={6} color="green.500" />
                </Box>
                <Box>
                  <StatLabel color="gray.500">Tổng doanh thu</StatLabel>
                  <StatNumber fontSize="2xl" color="green.500">
                    {formatCurrency(income)}
                  </StatNumber>
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
                <Box>
                  <StatLabel color="gray.500">Tổng đơn hàng</StatLabel>
                  <StatNumber fontSize="2xl" color="blue.500">
                    {orders}
                  </StatNumber>
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
                  <Icon as={FiUsers} boxSize={6} color="purple.500" />
                </Box>
                <Box>
                  <StatLabel color="gray.500">Khách hàng mỗi ngày</StatLabel>
                  <StatNumber fontSize="2xl" color="purple.500">
                    {members}
                  </StatNumber>
                </Box>
              </Flex>
            </Stat>
          </CardBody>
        </Card>

        <Card bg="white" shadow="sm">
          <CardBody>
            <Stat>
              <Flex align="center">
                <Box p={3} bg="yellow.50" borderRadius="full" mr={4}>
                  <Icon as={FiStar} boxSize={6} color="yellow.500" />
                </Box>
                <Box>
                  <StatLabel color="gray.500">Đánh giá</StatLabel>
                  <StatNumber fontSize="2xl" color="yellow.500">
                    {reviews}
                  </StatNumber>
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
                w="150px"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
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
            </HStack>
          </Flex>

          <Box h="400px">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={dailyStats}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="totalIncome" 
                  name="Doanh thu"
                  fill="#82ca9d" 
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  dataKey="totalOrder" 
                  name="Đơn hàng"
                  fill="#8884d8"
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  dataKey="totalBooking" 
                  name="Đặt chỗ"
                  fill="#ffc658" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </CardBody>
      </Card>
    </Stack>
  );
}