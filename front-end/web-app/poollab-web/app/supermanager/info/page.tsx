'use client';

import {
  Box,
  Container,
  Stack,
  Flex,
  Text,
  Heading,
  VStack,
  HStack,
  Badge,
  Button,
  Icon,
  Card,
  CardHeader,
  CardBody,
  useColorModeValue,
  Spinner,
} from '@chakra-ui/react';
import { useState } from 'react';
import { 
  FiMail, 
  FiPhone, 
  FiCalendar, 
  FiUser, 
  FiEdit,
  FiKey
} from 'react-icons/fi';
import { useAccountInfo } from '@/hooks/useAccountInfo';
import { EditInfoModal } from '@/components/manager/EditInfoModal';
import { ChangePasswordModal } from '@/components/manager/ChangePasswordModal';
import { AvatarUpload } from '@/components/manager/AvatarUpload';

export default function InfoPage() {
  const { managerData, roleName, loading, updateInfo, updatePassword } = useAccountInfo();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const cardBg = useColorModeValue('white', 'gray.700');

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
            <AvatarUpload
              currentAvatarUrl={managerData.avatarUrl}
              onAvatarChange={(url) => {
                if (managerData) {
                  updateInfo({
                    ...managerData,
                    avatarUrl: url
                  });
                }
              }}
              size="2xl"
            />
            <VStack spacing={2}>
              <Heading size="lg">{managerData.fullName}</Heading>
              <HStack>
                <Badge colorScheme="blue" px={2} py={1}>
                {roleName}
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
                  onClick={() => setIsPasswordModalOpen(true)}
                >
                  Đổi mật khẩu
                </Button>
                <Button
                  leftIcon={<Icon as={FiEdit} />}
                  size="sm"
                  colorScheme="blue"
                  onClick={() => setIsEditModalOpen(true)}
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
                    • Quản thông tin nhiều cửa hàng
                  </Text>
                  <Text fontSize="sm" color="green.700">
                    • Quản lý đơn hàng và báo cáo
                  </Text>
                  <Text fontSize="sm" color="green.700">
                    • Xem thống kê và báo cáo
                  </Text>
                </VStack>
              </Box>
            </VStack>
          </CardBody>
        </Card>
      </Stack>

      <EditInfoModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        currentInfo={managerData}
        onSubmit={updateInfo}
      />
      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onSubmit={updatePassword}
      />
    </Container>
  );
}