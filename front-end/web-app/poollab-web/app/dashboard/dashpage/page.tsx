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
  Switch,
  FormControl,
  FormLabel,
  Select,
  HStack,
} from '@chakra-ui/react';
import { useState } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// Interface cho dữ liệu cửa hàng
interface StoreData {
  id: number;
  name: string;
  revenue: number;
  lastRevenue: number;
  percentChange: number;
  color: string;
  orders: number;
  lastOrders: number;
  averageOrderValue: number;
}

// Dữ liệu mẫu cho các cửa hàng
const stores: StoreData[] = [
  {
    id: 1,
    name: 'Chi nhánh Quận 1',
    revenue: 125000000,
    lastRevenue: 115000000,
    percentChange: 8.7,
    color: '#FF6B6B',
    orders: 150,
    lastOrders: 130,
    averageOrderValue: 833333
  },
  {
    id: 2,
    name: 'Chi nhánh Quận 2',
    revenue: 98000000,
    lastRevenue: 102000000,
    percentChange: -3.9,
    color: '#4ECDC4',
    orders: 120,
    lastOrders: 110,
    averageOrderValue: 816666
  },
  {
    id: 3,
    name: 'Chi nhánh Quận 3',
    revenue: 145000000,
    lastRevenue: 128000000,
    percentChange: 13.3,
    color: '#45B7D1',
    orders: 163,
    lastOrders: 140,
    averageOrderValue: 889571
  },
  {
    id: 4,
    name: 'Chi nhánh Tân Bình',
    revenue: 88000000,
    lastRevenue: 85000000,
    percentChange: 3.5,
    color: '#96CEB4',
    orders: 100,
    lastOrders: 90,
    averageOrderValue: 880000
  }
];

// Tạo dữ liệu cho biểu đồ
const generateChartData = () => {
  const dates = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
  });

  return dates.map(date => {
    const data: any = { date };
    stores.forEach(store => {
      const baseRevenue = store.revenue / 30;
      const random = 0.8 + Math.random() * 0.4; // Random factor between 0.8 and 1.2
      data[store.name] = Math.round(baseRevenue * random);
    });
    data['Tổng'] = Object.values(data)
      .filter(value => typeof value === 'number')
      .reduce((a: any, b: any) => a + b, 0);
    return data;
  });
};

export default function DashPage() {
  const [showAllStores, setShowAllStores] = useState(true);
  const [timeRange, setTimeRange] = useState('30days');
  const [chartType, setChartType] = useState<'line' | 'bar' | 'area'>('line');

  // Format tiền VND
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  // Tính toán các tổng
  const totalRevenue = stores.reduce((sum, store) => sum + store.revenue, 0);
  const totalLastRevenue = stores.reduce((sum, store) => sum + store.lastRevenue, 0);
  const totalPercentChange = ((totalRevenue - totalLastRevenue) / totalLastRevenue) * 100;
  const totalOrders = stores.reduce((sum, store) => sum + store.orders, 0);
  const totalLastOrders = stores.reduce((sum, store) => sum + store.lastOrders, 0);
  const ordersPercentChange = ((totalOrders - totalLastOrders) / totalLastOrders) * 100;
  const averageOrderValue = totalRevenue / totalOrders;
  const lastAverageOrderValue = totalLastRevenue / totalLastOrders;
  const averageOrderPercentChange = ((averageOrderValue - lastAverageOrderValue) / lastAverageOrderValue) * 100;

  const chartData = generateChartData();

  // Custom tooltip cho biểu đồ
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

  // Render biểu đồ theo loại
  const renderChart = () => {
    const commonProps = {
      data: chartData,
      children: [
        <CartesianGrid strokeDasharray="3 3" key="grid" />,
        <XAxis 
          dataKey="date"
          tick={{ fontSize: 12 }}
          key="xAxis"
        />,
        <YAxis
          tickFormatter={(value) => 
            new Intl.NumberFormat('vi-VN', {
              notation: 'compact',
              compactDisplay: 'short',
              maximumFractionDigits: 1
            }).format(value)
          }
          tick={{ fontSize: 12 }}
          key="yAxis"
        />,
        <Tooltip content={<CustomTooltip />} key="tooltip" />,
        <Legend 
          verticalAlign="top"
          height={36}
          formatter={(value) => <span style={{ fontSize: '12px' }}>{value}</span>}
          key="legend"
        />
      ]
    };

    switch (chartType) {
      case 'line':
        return (
          <LineChart {...commonProps}>
            {commonProps.children}
            {showAllStores && (
              <Line
                type="monotone"
                dataKey="Tổng"
                stroke="#2D3748"
                strokeWidth={2}
                dot={false}
              />
            )}
            {stores.map(store => (
              <Line
                key={store.id}
                type="monotone"
                dataKey={store.name}
                stroke={store.color}
                strokeWidth={2}
                dot={false}
              />
            ))}
          </LineChart>
        );
      case 'bar':
        return (
          <BarChart {...commonProps}>
            {commonProps.children}
            {showAllStores && (
              <Bar dataKey="Tổng" fill="#2D3748" />
            )}
            {stores.map(store => (
              <Bar key={store.id} dataKey={store.name} fill={store.color} />
            ))}
          </BarChart>
        );
      case 'area':
        return (
          <AreaChart {...commonProps}>
            {commonProps.children}
            {showAllStores && (
              <Area
                type="monotone"
                dataKey="Tổng"
                fill="#2D3748"
                stroke="#2D3748"
                fillOpacity={0.3}
              />
            )}
            {stores.map(store => (
              <Area
                key={store.id}
                type="monotone"
                dataKey={store.name}
                fill={store.color}
                stroke={store.color}
                fillOpacity={0.3}
              />
            ))}
          </AreaChart>
        );
    }
  };

  return (
    <Stack spacing={6}>
      {/* Thống kê tổng quan */}
      <Grid templateColumns="repeat(3, 1fr)" gap={6}>
        <Card>
          <CardBody>
            <Stat>
              <StatLabel fontSize="lg">Tổng doanh thu</StatLabel>
              <StatNumber fontSize="2xl" color="green.500">
                {formatCurrency(totalRevenue)}
              </StatNumber>
              <StatHelpText>
                <StatArrow type={totalPercentChange >= 0 ? 'increase' : 'decrease'} />
                {Math.abs(totalPercentChange).toFixed(1)}% so với kỳ trước
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Stat>
              <StatLabel fontSize="lg">Tổng đơn hàng</StatLabel>
              <StatNumber fontSize="2xl" color="blue.500">
                {totalOrders.toLocaleString()}
              </StatNumber>
              <StatHelpText>
                <StatArrow type={ordersPercentChange >= 0 ? 'increase' : 'decrease'} />
                {Math.abs(ordersPercentChange).toFixed(1)}% so với kỳ trước
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Stat>
              <StatLabel fontSize="lg">Giá trị đơn trung bình</StatLabel>
              <StatNumber fontSize="2xl" color="purple.500">
                {formatCurrency(averageOrderValue)}
              </StatNumber>
              <StatHelpText>
                <StatArrow type={averageOrderPercentChange >= 0 ? 'increase' : 'decrease'} />
                {Math.abs(averageOrderPercentChange).toFixed(1)}% so với kỳ trước
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>
      </Grid>

      {/* Biểu đồ doanh thu */}
      <Card>
        <CardBody>
          <Flex justifyContent="space-between" alignItems="center" mb={4}>
            <Heading size="md">Biểu đồ doanh thu</Heading>
            <HStack spacing={4}>
              <Select 
                size="sm"
                width="150px"
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
              >
                <option value="7days">7 ngày qua</option>
                <option value="30days">30 ngày qua</option>
                <option value="90days">90 ngày qua</option>
              </Select>

              <Select
                size="sm"
                width="150px"
                value={chartType}
                onChange={(e) => setChartType(e.target.value as 'line' | 'bar' | 'area')}
              >
                <option value="line">Đường</option>
                <option value="bar">Cột</option>
                <option value="area">Vùng</option>
              </Select>

              <FormControl display="flex" alignItems="center">
                <FormLabel mb="0" mr={2}>
                  Hiển thị tất cả
                </FormLabel>
                <Switch
                  isChecked={showAllStores}
                  onChange={(e) => setShowAllStores(e.target.checked)}
                  colorScheme="blue"
                />
              </FormControl>
            </HStack>
          </Flex>

          <Box height="400px">
            <ResponsiveContainer width="100%" height="100%">
              {renderChart()}
            </ResponsiveContainer>
          </Box>
        </CardBody>
      </Card>

      {/* Bảng chi tiết doanh thu */}
      <Card>
        <CardBody>
          <Heading size="md" mb={4}>Chi tiết doanh thu theo cửa hàng</Heading>
          <Table>
            <Thead>
              <Tr>
                <Th>Cửa hàng</Th>
                <Th isNumeric>Doanh thu</Th>
                <Th isNumeric>Số đơn</Th>
                <Th isNumeric>TB/Đơn</Th>
                <Th isNumeric>% Thay đổi DT</Th>
              </Tr>
            </Thead>
            <Tbody>
              {stores.map((store) => (
                <Tr key={store.id}>
                  <Td fontWeight="medium">{store.name}</Td>
                  <Td isNumeric>{formatCurrency(store.revenue)}</Td>
                  <Td isNumeric>{store.orders.toLocaleString()}</Td>
                  <Td isNumeric>{formatCurrency(store.averageOrderValue)}</Td>
                  <Td isNumeric>
                    <Text color={store.percentChange >= 0 ? 'green.500' : 'red.500'}>
                      {store.percentChange >= 0 ? '+' : ''}{store.percentChange.toFixed(1)}%
                    </Text>
                  </Td>
                </Tr>
              ))}
              <Tr fontWeight="bold" bg="gray.50">
                <Td>Tổng cộng</Td>
                <Td isNumeric>{formatCurrency(totalRevenue)}</Td>
                <Td isNumeric>{totalOrders.toLocaleString()}</Td>
                <Td isNumeric>{formatCurrency(averageOrderValue)}</Td>
                <Td isNumeric>
                  <Text color={totalPercentChange >= 0 ? 'green.500' : 'red.500'}>
                    {totalPercentChange >= 0 ? '+' : ''}{totalPercentChange.toFixed(1)}%
                  </Text>
                </Td>
              </Tr>
            </Tbody>
          </Table>
        </CardBody>
      </Card>
    </Stack>
  );
}