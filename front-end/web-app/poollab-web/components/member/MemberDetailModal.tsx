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
import { FiMail, FiPhone, FiCalendar, FiDollarSign } from 'react-icons/fi';
import { Staff as Member } from '@/utils/types/staff.types';
import { formatCurrency, formatDateTime } from '@/utils/format';

interface MemberDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: Member | null;
}

export const MemberDetailModal = ({
  isOpen,
  onClose,
  member
}: MemberDetailModalProps) => {
  if (!member) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Chi tiết thành viên</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Stack spacing={6}>
            <Flex align="center" gap={4}>
              <Avatar
                size="xl"
                name={member.fullName}
                src={member.avatarUrl || undefined}
              />
              <Box>
                <Heading size="md">{member.fullName}</Heading>
                <Text color="gray.500">{member.userName}</Text>
                <Badge
                  mt={2}
                  colorScheme={member.status === 'Kích hoạt' ? 'green' : 'red'}
                >
                  {member.status === 'Kích hoạt' ? 'Hoạt động' : 'Ngừng hoạt động'}
                </Badge>
              </Box>
            </Flex>

            <Grid templateColumns="repeat(2, 1fr)" gap={4}>
              <Box>
                <HStack color="gray.600" mb={1}>
                  <Icon as={FiMail} />
                  <Text>Email</Text>
                </HStack>
                <Text fontWeight="medium">{member.email}</Text>
              </Box>

              <Box>
                <HStack color="gray.600" mb={1}>
                  <Icon as={FiPhone} />
                  <Text>Số điện thoại</Text>
                </HStack>
                <Text fontWeight="medium">
                  {member.phoneNumber || "Chưa cập nhật"}
                </Text>
              </Box>

              <Box>
                <HStack color="gray.600" mb={1}>
                  <Icon as={FiDollarSign} />
                  <Text>Số dư</Text>
                </HStack>
                <Text fontWeight="medium" color="blue.500">
                  {formatCurrency(member.balance)}
                </Text>
              </Box>

              <Box>
                <HStack color="gray.600" mb={1}>
                  <Icon as={FiCalendar} />
                  <Text>Ngày tham gia</Text>
                </HStack>
                <Text fontWeight="medium">
                  {formatDateTime(member.joinDate)}
                </Text>
              </Box>
            </Grid>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
