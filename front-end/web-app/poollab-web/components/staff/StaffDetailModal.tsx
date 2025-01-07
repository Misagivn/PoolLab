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
  Image,
} from '@chakra-ui/react';
import { FiMail, FiPhone, FiCalendar } from 'react-icons/fi';
import { Staff } from '@/utils/types/staff.types';

interface StaffDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  staff: Staff | null;
}

export const StaffDetailModal = ({
  isOpen,
  onClose,
  staff
}: StaffDetailModalProps) => {
  if (!staff) return null;

  const getWorkingStatus = (status: string) => {
    return status === 'Kích hoạt' ? 'Đang làm việc' : 'Đã nghỉ việc';
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Thông tin nhân viên</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Stack spacing={6}>
            <Flex align="center" gap={4}>
              <Avatar
                size="xl"
                name={staff.fullName}
                src={staff.avatarUrl}
              />
              <Box>
                <Heading size="md">{staff.fullName}</Heading>
                <Text color="gray.500">{staff.userName}</Text>
                <Badge
                  mt={2}
                  colorScheme={staff.status === 'Kích Hoạt' ? 'green' : 'red'}
                >
                  {staff.status === 'Kích Hoạt' ? 'Hoạt động' : 'Đã khóa'}
                </Badge>
              </Box>
            </Flex>

            <Grid templateColumns="repeat(2, 1fr)" gap={4}>
              <Box>
                <HStack color="gray.600" mb={1}>
                  <Icon as={FiMail} />
                  <Text>Email</Text>
                </HStack>
                <Text fontWeight="medium">{staff.email}</Text>
              </Box>

              <Box>
                <HStack color="gray.600" mb={1}>
                  <Icon as={FiPhone} />
                  <Text>Số điện thoại</Text>
                </HStack>
                <Text fontWeight="medium">
                  {staff.phoneNumber || "Chưa cập nhật"}
                </Text>
              </Box>

              <Box>
                <HStack color="gray.600" mb={1}>
                  <Icon as={FiCalendar} />
                  <Text>Ngày vào làm</Text>
                </HStack>
                <Text fontWeight="medium">
                  {new Date(staff.joinDate).toLocaleDateString('vi-VN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </Text>
              </Box>
            </Grid>

            {staff.avatarUrl && (
              <Box 
                mt={4} 
                borderRadius="lg" 
                overflow="hidden"
                border="1px solid"
                borderColor="gray.200"
              >
                <Image
                  src={staff.avatarUrl}
                  alt={staff.fullName}
                  width="100%"
                  height="auto"
                  objectFit="cover"
                />
              </Box>
            )}
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};