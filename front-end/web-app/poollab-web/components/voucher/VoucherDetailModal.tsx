import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Stack,
  VStack,
  Text,
  Box,
  HStack,
  Badge,
  Icon,
} from '@chakra-ui/react';
import { FiTag, FiCalendar, FiPercent, FiAward } from 'react-icons/fi';
import { Voucher } from '@/utils/types/voucher.types';

interface VoucherDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  voucher: Voucher | null;
}

export const VoucherDetailModal = ({ isOpen, onClose, voucher }: VoucherDetailModalProps) => {
  if (!voucher) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Chi tiết voucher</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Stack spacing={6}>
            <VStack align="start" spacing={4}>
              <Box>
                <Text fontWeight="bold" fontSize="xl">
                  {voucher.name}
                </Text>
                <HStack spacing={2} mt={1}>
                  <Badge colorScheme={voucher.status === 'Kích Hoạt' ? 'green' : 'red'}>
                    {voucher.status}
                  </Badge>
                  <Badge colorScheme="blue">{voucher.vouCode}</Badge>
                </HStack>
              </Box>

              <VStack align="start" spacing={2} width="100%">
                <HStack>
                  <Icon as={FiTag} color="gray.500" />
                  <Text>{voucher.description}</Text>
                </HStack>

                <HStack>
                  <Icon as={FiPercent} color="gray.500" />
                  <Text>Giảm giá: {voucher.discount}%</Text>
                </HStack>

                <HStack>
                  <Icon as={FiAward} color="gray.500" />
                  <Text>Điểm đổi: {voucher.point} điểm</Text>
                </HStack>
              </VStack>

              <Box width="100%">
                <Text fontWeight="semibold" mb={1}>Thông tin thêm:</Text>
                <Stack spacing={1} fontSize="sm" color="gray.600">
                  <HStack>
                    <Icon as={FiCalendar} />
                    <Text>Ngày tạo: {new Date(voucher.createdDate).toLocaleDateString('vi-VN')}</Text>
                  </HStack>
                  {voucher.updatedDate && (
                    <HStack>
                      <Icon as={FiCalendar} />
                      <Text>
                        Cập nhật lần cuối: {new Date(voucher.updatedDate).toLocaleDateString('vi-VN')}
                      </Text>
                    </HStack>
                  )}
                </Stack>
              </Box>
            </VStack>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};