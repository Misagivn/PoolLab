// app/dashboard/page.tsx
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
  FiTrendingUp, 
  FiTrendingDown, 
  FiDollarSign, 
  FiShoppingBag, 
  FiUsers, 
  FiBarChart 
} from 'react-icons/fi';
import Sidebar from '../components/sideBar';

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
  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const cardBg = useColorModeValue('white', 'gray.700');

  return (
    <Flex minH="100vh" bg={bgColor}>
      <Sidebar />
      <Box flex="1" ml="64" p="6">
        <Container maxW="container.xl">
          {/* Stats Grid */}
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing="6" mb="6">
            <StatCard
              title="Total Sales"
              value="$654.66k"
              percentage={16.24}
              icon={FiDollarSign}
              isIncrease={true}
            />
            <StatCard
              title="Total Orders"
              value="$854.66k"
              percentage={4.82}
              icon={FiShoppingBag}
              isIncrease={false}
            />
            <StatCard
              title="Daily Visitors"
              value="$987.21M"
              percentage={2.45}
              icon={FiUsers}
              isIncrease={true}
            />
            <StatCard
              title="Conversion Rate"
              value="1.75%"
              percentage={1.75}
              icon={FiBarChart}
              isIncrease={true}
            />
          </SimpleGrid>

          {/* Charts Grid */}
          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing="6" mb="6">
            <Box bg={cardBg} p="6" borderRadius="lg" shadow="sm">
              <Text fontSize="lg" fontWeight="medium" mb="4">Monthly Progress</Text>
              <Stack spacing="4">
                <ProgressStat label="Revenue" value={75} />
                <ProgressStat label="Sales" value={65} />
                <ProgressStat label="Users" value={85} />
              </Stack>
            </Box>

            <Box bg={cardBg} p="6" borderRadius="lg" shadow="sm">
              <Text fontSize="lg" fontWeight="medium" mb="4">Monthly Statistics</Text>
              <SimpleGrid columns={3} spacing="4">
                <CircularStatCard label="Profit" value={68} />
                <CircularStatCard label="Revenue" value={75} />
                <CircularStatCard label="Expenses" value={55} />
              </SimpleGrid>
            </Box>
          </SimpleGrid>

          {/* Bottom Grid */}
          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing="6">
            <Box bg={cardBg} p="6" borderRadius="lg" shadow="sm">
              <Text fontSize="lg" fontWeight="medium" mb="4">Earning Updates</Text>
              <Stack spacing="4">
                <ProgressStat label="Marketing" value={50} color="blue" />
                <ProgressStat label="Payments" value={70} color="green" />
                <ProgressStat label="Sales" value={85} color="purple" />
              </Stack>
            </Box>

            <Box bg={cardBg} p="6" borderRadius="lg" shadow="sm">
              <Text fontSize="lg" fontWeight="medium" mb="4">Performance Overview</Text>
              <Flex justify="space-around" align="center" h="full">
                <CircularStatCard label="Completed" value={75} color="green" />
                <CircularStatCard label="Pending" value={45} color="orange" />
                <CircularStatCard label="Canceled" value={25} color="red" />
              </Flex>
            </Box>
          </SimpleGrid>
        </Container>
      </Box>
    </Flex>
  );
}