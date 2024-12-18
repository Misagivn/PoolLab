import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Stack,
  Flex,
  Avatar,
  Box,
  Heading,
  Text,
  Badge,
  Grid,
  HStack,
  Icon,
} from '@chakra-ui/react';
import { FiMail, FiPhone, FiCalendar, FiMapPin } from 'react-icons/fi';
import { Manager } from '@/utils/types/manager.type';
import { Store } from '@/utils/types/store';

interface ManagerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  manager: Manager | null;
  stores: Store[];
}

export const ManagerDetailModal = ({
  isOpen,
  onClose,
  manager,
  stores
}: ManagerDetailModalProps) => {
  if (!manager) return null;

  const store = stores.find(s => s.id === manager.storeId);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Chi tiết quản lý</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Stack spacing={6}>
            <Flex align="center" gap={4}>
              <Avatar
                size="xl"
                name={manager.fullName}
                src={manager.avatarUrl}
              />
              <Box>
                <Heading size="md">{manager.fullName}</Heading>
                <Text color="gray.500">{manager.userName}</Text>
                <Badge
                  mt={2}
                  colorScheme={manager.status === 'Kích Hoạt' ? 'green' : 'red'}
                >
                  {manager.status === 'Kích Hoạt' ? 'Hoạt động' : 'Đã khóa'}
                </Badge>
              </Box>
            </Flex>

            <Grid templateColumns="repeat(2, 1fr)" gap={4}>
              <Box>
                <HStack color="gray.600" mb={1}>
                  <Icon as={FiMail} />
                  <Text>Email</Text>
                </HStack>
                <Text fontWeight="medium">{manager.email}</Text>
              </Box>

              <Box>
                <HStack color="gray.600" mb={1}>
                  <Icon as={FiPhone} />
                  <Text>Số điện thoại</Text>
                </HStack>
                <Text fontWeight="medium">
                  {manager.phoneNumber || "Chưa cập nhật"}
                </Text>
              </Box>

              <Box>
                <HStack color="gray.600" mb={1}>
                  <Icon as={FiMapPin} />
                  <Text>Cửa hàng quản lý</Text>
                </HStack>
                <Text fontWeight="medium">
                  {store?.name || "Chưa gán cửa hàng"}
                </Text>
              </Box>

              <Box>
                <HStack color="gray.600" mb={1}>
                  <Icon as={FiCalendar} />
                  <Text>Ngày tham gia</Text>
                </HStack>
                <Text fontWeight="medium">
                  {new Date(manager.joinDate).toLocaleDateString('vi-VN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </Text>
              </Box>
            </Grid>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};