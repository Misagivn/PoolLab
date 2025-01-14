import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Stack,
  HStack,
  VStack,
  Text,
  Image,
  Badge,
  Divider,
} from '@chakra-ui/react';
import { BilliardTable } from '@/utils/types/table.types';

interface BilliardTableDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  table: BilliardTable | null;
}

export const BilliardTableDetailModal = ({
  isOpen,
  onClose,
  table
}: BilliardTableDetailModalProps) => {
  if (!table) return null;

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Chi tiết bàn</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Stack spacing={4}>
            {table.image && (
              <Image
                src={table.image}
                alt={table.name}
                width="100%"
                height="300px"
                objectFit="cover"
                borderRadius="md"
              />
            )}

            <VStack align="stretch" spacing={3}>
              <HStack justify="space-between">
                <Text fontWeight="bold" fontSize="xl">{table.name}</Text>
                <Badge colorScheme="green">{table.status}</Badge>
              </HStack>

              <Text color="gray.600">{table.descript}</Text>

              <Divider />

              <HStack justify="space-between">
                <Text fontWeight="medium">Khu vực:</Text>
                <Text>{table.areaName}</Text>
              </HStack>

              <HStack justify="space-between">
                <Text fontWeight="medium">Loại bàn:</Text>
                <Text>{table.bidaTypeName}</Text>
              </HStack>

              <HStack justify="space-between">
                <Text fontWeight="medium">Giá:</Text>
                <Text>{formatPrice(table.oldPrice)}</Text>
              </HStack>

              <HStack justify="space-between">
                <Text fontWeight="medium">Cửa hàng:</Text>
                <Text>{table.storeName}</Text>
              </HStack>

              <VStack align="start" spacing={1}>
                <Text fontWeight="medium">Địa chỉ:</Text>
                <Text>{table.address}</Text>
              </VStack>

              {table.qrcode && (
                <Image
                  src={table.qrcode}
                  alt="QR Code"
                  width="200px"
                  alignSelf="center"
                />
              )}

              <Divider />

              <HStack justify="space-between">
                <Text fontWeight="medium">Ngày tạo:</Text>
                <Text>{formatDateTime(table.createdDate)}</Text>
              </HStack>

              {table.updatedDate && (
                <HStack justify="space-between">
                  <Text fontWeight="medium">Cập nhật lần cuối:</Text>
                  <Text>{formatDateTime(table.updatedDate)}</Text>
                </HStack>
              )}
            </VStack>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};