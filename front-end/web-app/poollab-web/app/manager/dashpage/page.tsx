
"use client";

import { 
  Box, 
  Flex, 
  Text, 
  SimpleGrid, 
  Container, 
  useColorModeValue,
  Progress,
  CircularProgress,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Stack,
  Icon
} from '@chakra-ui/react';
import { 
  FiDollarSign, 
  FiShoppingBag, 
  FiUsers, 
  FiBarChart 
} from 'react-icons/fi';

// Các component phụ nên được tách ra file riêng
interface StatCardProps {
  title: string;
  value: string;
  percentage: number;
  icon: any;
  isIncrease: boolean;
}

const StatCard = ({ title, value, percentage, icon, isIncrease }: StatCardProps) => {
  const cardBg = useColorModeValue('white', 'gray.700');
  
  return (
    <Box p="6" bg={cardBg} borderRadius="lg" shadow="sm">
      <Flex alignItems="center" mb="2">
        <Icon as={icon} w="6" h="6" color={isIncrease ? "green.500" : "red.500"} />
      </Flex>
      <Stat>
        <StatLabel fontSize="sm" color="gray.500">{title}</StatLabel>
        <StatNumber fontSize="2xl" fontWeight="bold">{value}</StatNumber>
        <StatHelpText>
          <StatArrow type={isIncrease ? "increase" : "decrease"} />
          {percentage}%
        </StatHelpText>
      </Stat>
    </Box>
  );
};

interface ProgressStatProps {
  label: string;
  value: number;
  color?: string;
}

const ProgressStat = ({ label, value, color = "blue" }: ProgressStatProps) => {
  return (
    <Box>
      <Flex justify="space-between" mb="2">
        <Text fontSize="sm" fontWeight="medium">{label}</Text>
        <Text fontSize="sm" fontWeight="medium">{value}%</Text>
      </Flex>
      <Progress value={value} size="sm" colorScheme={color} borderRadius="full" />
    </Box>
  );
};

interface CircularStatCardProps {
  label: string;
  value: number;
  color?: string;
}

const CircularStatCard = ({ label, value, color = "blue" }: CircularStatCardProps) => {
  return (
    <Box textAlign="center">
      <CircularProgress 
        value={value} 
        size="100px" 
        thickness="8px"
        color={`${color}.400`}
      >
      </CircularProgress>
      <Text mt="2" fontSize="sm" fontWeight="medium">{label}</Text>
      <Text fontSize="lg" fontWeight="bold">{value}%</Text>
    </Box>
  );
};

export default function DashboardPage() {
  const cardBg = useColorModeValue('white', 'gray.700');

  return (
    <Container maxW="container.xl">
      {/* Stats Grid */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing="6" mb="6">
        <StatCard
          title="Tổng Doanh Số"
          value="20.000.000 ₫"
          percentage={16.24}
          icon={FiDollarSign}
          isIncrease={true}
        />
        <StatCard
          title="Tổng Số Đơn Hàng "
          value="500 đơn"
          percentage={4.82}
          icon={FiShoppingBag}
          isIncrease={false}
        />
        <StatCard
          title="Khách Mỗi Ngày"
          value="500"
          percentage={2.45}
          icon={FiUsers}
          isIncrease={true}
        />
        <StatCard
          title="Đánh Giá"
          value="1.75%"
          percentage={1.75}
          icon={FiBarChart}
          isIncrease={true}
        />
      </SimpleGrid>

      {/* Charts Grid */}
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing="6" mb="6">
        <Box bg={cardBg} p="6" borderRadius="lg" shadow="sm">
          <Text fontSize="lg" fontWeight="medium" mb="4">Tiến độ hàng tháng</Text>
          <Stack spacing="4">
            <ProgressStat label="Doanh thu" value={75} />
            <ProgressStat label="bán hàng" value={65} />
            <ProgressStat label="Người dụng" value={85} />
          </Stack>
        </Box>

        <Box bg={cardBg} p="6" borderRadius="lg" shadow="sm">
          <Text fontSize="lg" fontWeight="medium" mb="4">Thống kê hàng tháng</Text>
          <SimpleGrid columns={3} spacing="4">
            <CircularStatCard label="Lợi nhuận" value={68} />
            <CircularStatCard label="Doanh thu" value={75} />
            <CircularStatCard label="Chi phí" value={55} />
          </SimpleGrid>
        </Box>
      </SimpleGrid>

      {/* Bottom Grid */}
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing="6">
        <Box bg={cardBg} p="6" borderRadius="lg" shadow="sm">
          <Text fontSize="lg" fontWeight="medium" mb="4">Cập nhật thu nhập</Text>
          <Stack spacing="4">
            <ProgressStat label="Tiếp thị" value={50} color="blue" />
            <ProgressStat label="Thanh toán" value={70} color="green" />
            <ProgressStat label="Doanh thu" value={85} color="purple" />
          </Stack>
        </Box>

        <Box bg={cardBg} p="6" borderRadius="lg" shadow="sm">
          <Text fontSize="lg" fontWeight="medium" mb="4">Tổng quan về hiệu suất</Text>
          <Flex justify="space-around" align="center" h="full">
            <CircularStatCard label="Hoàn thành" value={75} color="green" />
            <CircularStatCard label="Chưa giải quyết" value={45} color="orange" />
            <CircularStatCard label="Đã hủy" value={25} color="red" />
          </Flex>
        </Box>
      </SimpleGrid>
    </Container>
  );
}