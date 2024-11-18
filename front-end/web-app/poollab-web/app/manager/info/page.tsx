'use client';

import {
  Box,
  Container,
  Stack,
  Flex,
  Avatar,
  Text,
  Heading,
  VStack,
  HStack,
  Badge,
  useToast,
  Spinner,
  Button,
  Icon,
  Card,
  CardHeader,
  CardBody,
  useColorModeValue,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { 
  FiMail, 
  FiPhone, 
  FiCalendar, 
  FiUser, 
  FiEdit,
  FiKey
} from 'react-icons/fi';

interface ManagerData {
  id: string;
  email: string;
  avatarUrl: string;
  userName: string;
  fullName: string;
  phoneNumber: string;
  roleId: string;
  storeId: string | null;
  companyId: string | null;
  joinDate: string;
  status: string;
}

export default function InfoPage() {
  const [managerData, setManagerData] = useState<ManagerData | null>(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const cardBg = useColorModeValue('white', 'gray.700');

  useEffect(() => {
    const fetchManagerData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');

        const decoded = jwtDecode(token) as any;
        const accountId = decoded.accountId;

        const response = await fetch(
          `https://poollabwebapi20241008201316.azurewebsites.net/api/Account/GetAccountByID/${accountId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = await response.json();
        if (data.status === 200) {
          setManagerData(data.data);
        }
      } catch (err) {
        toast({
          title: 'Lỗi',
          description: 'Không thể tải thông tin tài khoản',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchManagerData();
  }, [toast]);

  if (loading) {
    return (
      <Flex h="calc(100vh - 80px)" align="center" justify="center">
        <Spinner size="xl" color="blue.500" thickness="4px" />
      </Flex>
    );
  }

  if (!managerData) {
    return (
      <Flex h="calc(100vh - 80px)" align="center" justify="center">
        <Text>Không tìm thấy thông tin tài khoản</Text>
      </Flex>
    );
  }

  return (
    <Container maxW="container.xl" py={6}>
      {/* Profile Summary Card */}
      <Card mb={6} bg={cardBg} position="relative" overflow="hidden">
        <Box 
          position="absolute" 
          top={0} 
          left={0} 
          right={0} 
          h="120px" 
          bg="blue.600" 
        />
        <CardBody position="relative" pt={16}>
          <VStack spacing={4} align="center">
            <Avatar
              size="2xl"
              src={managerData.avatarUrl || 'https://bit.ly/broken-link'}
              name={managerData.fullName}
              border="4px solid white"
            />
            <VStack spacing={2}>
              <Heading size="lg">{managerData.fullName}</Heading>
              <HStack>
                <Badge colorScheme="blue" px={2} py={1}>
                  Manager
                </Badge>
                <Badge 
                  colorScheme={managerData.status === 'Kích hoạt' ? 'green' : 'red'}
                  px={2}
                  py={1}
                >
                  {managerData.status}
                </Badge>
              </HStack>
            </VStack>
          </VStack>
        </CardBody>
      </Card>

      <Stack spacing={6} direction={{ base: 'column', lg: 'row' }}>
        {/* Personal Information */}
        <Card flex={2} bg={cardBg}>
          <CardHeader>
            <Flex justify="space-between" align="center">
              <Heading size="md">Thông tin cá nhân</Heading>
              <HStack spacing={2}>
                <Button
                  leftIcon={<Icon as={FiKey} />}
                  size="sm"
                  colorScheme="blue"
                  variant="ghost"
                  onClick={() => {
                    toast({
                      title: "Thông báo",
                      description: "Tính năng sẽ sớm được cập nhật",
                      status: "info",
                      duration: 3000,
                      isClosable: true,
                    });
                  }}
                >
                  Đổi mật khẩu
                </Button>
                <Button
                  leftIcon={<Icon as={FiEdit} />}
                  size="sm"
                  colorScheme="blue"
                  onClick={() => {
                    toast({
                      title: "Thông báo",
                      description: "Tính năng sẽ sớm được cập nhật",
                      status: "info",
                      duration: 3000,
                      isClosable: true,
                    });
                  }}
                >
                  Chỉnh sửa
                </Button>
              </HStack>
            </Flex>
          </CardHeader>
          <CardBody>
            <VStack align="stretch" spacing={4}>
              <HStack>
                <Icon as={FiUser} color="blue.500" boxSize={5} />
                <Text fontWeight="bold" minW="150px">Họ và tên:</Text>
                <Text>{managerData.fullName}</Text>
              </HStack>
              <HStack>
                <Icon as={FiUser} color="blue.500" boxSize={5} />
                <Text fontWeight="bold" minW="150px">Tên tài khoản:</Text>
                <Text>{managerData.userName}</Text>
              </HStack>
              <HStack>
                <Icon as={FiMail} color="blue.500" boxSize={5} />
                <Text fontWeight="bold" minW="150px">Email:</Text>
                <Text>{managerData.email}</Text>
              </HStack>
              <HStack>
                <Icon as={FiPhone} color="blue.500" boxSize={5} />
                <Text fontWeight="bold" minW="150px">Số điện thoại:</Text>
                <Text>{managerData.phoneNumber || 'Chưa cập nhật'}</Text>
              </HStack>
              <HStack>
                <Icon as={FiCalendar} color="blue.500" boxSize={5} />
                <Text fontWeight="bold" minW="150px">Ngày tham gia:</Text>
                <Text>
                  {new Date(managerData.joinDate).toLocaleDateString('vi-VN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </Text>
              </HStack>
            </VStack>
          </CardBody>
        </Card>

        {/* Management Information */}
        <Card flex={1} bg={cardBg} height="fit-content">
          <CardHeader>
            <Heading size="md">Vai trò & Trạng thái</Heading>
          </CardHeader>
          <CardBody>
            <VStack align="stretch" spacing={4}>
              <Box 
                p={4} 
                bg="blue.50" 
                borderRadius="md"
                borderLeft="4px solid"
                borderLeftColor="blue.500"
              >
                <VStack align="start" spacing={2}>
                  <Text fontWeight="bold" color="blue.700">
                    Trạng thái tài khoản
                  </Text>
                  <Badge 
                    colorScheme={managerData.status === 'Kích hoạt' ? 'green' : 'red'}
                    px={2}
                    py={1}
                  >
                    {managerData.status}
                  </Badge>
                </VStack>
              </Box>

              <Box 
                p={4} 
                bg="green.50" 
                borderRadius="md"
                borderLeft="4px solid"
                borderLeftColor="green.500"
              >
                <VStack align="start" spacing={2}>
                  <Text fontWeight="bold" color="green.700">
                    Quyền hạn
                  </Text>
                  <Text fontSize="sm" color="green.700">
                    • Quản lý nhân viên và lịch làm việc
                  </Text>
                  <Text fontSize="sm" color="green.700">
                    • Quản lý bàn và khu vực
                  </Text>
                  <Text fontSize="sm" color="green.700">
                    • Quản lý đơn hàng và báo cáo
                  </Text>
                  <Text fontSize="sm" color="green.700">
                    • Xem thống kê và báo cáo
                  </Text>
                </VStack>
              </Box>

              {managerData.storeId && (
                <Box 
                  p={4} 
                  bg="purple.50" 
                  borderRadius="md"
                  borderLeft="4px solid"
                  borderLeftColor="purple.500"
                >
                  <VStack align="start" spacing={2}>
                    <Text fontWeight="bold" color="purple.700">
                      Phạm vi quản lý
                    </Text>
                    <Text fontSize="sm" color="purple.700">
                      Quản lý cửa hàng: {managerData.storeId}
                    </Text>
                  </VStack>
                </Box>
              )}
            </VStack>
          </CardBody>
        </Card>
      </Stack>
    </Container>
  );
}