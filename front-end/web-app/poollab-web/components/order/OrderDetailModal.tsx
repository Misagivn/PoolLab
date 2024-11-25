import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  VStack,
  HStack,
  Text,
  Badge,
  Divider,
  Box,
  Spinner
} from '@chakra-ui/react';
import { OrderDetail } from '@/utils/types/order.types';

interface OrderDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: OrderDetail | null;
  loading: boolean;
}

export const OrderDetailModal = ({
  isOpen,
  onClose,
  order,
  loading
}: OrderDetailModalProps) => {
  if (loading) {
    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalBody>
            <VStack py={8}>
              <Spinner size="xl" />
              <Text>Đang tải thông tin...</Text>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  }

  if (!order) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Chi tiết đơn hàng {order.orderCode}</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <VStack spacing={4} align="stretch">
            <Box>
              <HStack justify="space-between">
                <Text fontSize="lg" fontWeight="bold">{order.orderCode}</Text>
                <Badge colorScheme="green">{order.status}</Badge>
              </HStack>
              <Text color="gray.600">{formatDate(order.orderDate)}</Text>
            </Box>

            <Divider />

            <VStack align="stretch" spacing={2}>
              <Text fontWeight="bold">Thông tin khách hàng</Text>
              <Text>{order.username}</Text>
            </VStack>

            <Divider />

            <VStack align="stretch" spacing={2}>
              <Text fontWeight="bold">Thông tin cửa hàng</Text>
              <Text>{order.storeName}</Text>
              <Text color="gray.600">{order.address}</Text>
            </VStack>

            <Divider />

            {order.playTime && (
              <>
                <VStack align="stretch" spacing={2}>
                  <Text fontWeight="bold">Thông tin giờ chơi</Text>
                  <Text>Bắt đầu: {formatDate(order.playTime.timeStart)}</Text>
                  {order.playTime.timeEnd && (
                    <Text>Kết thúc: {formatDate(order.playTime.timeEnd)}</Text>
                  )}
                  <Text>Tổng thời gian: {order.playTime.totalTime} giờ</Text>
                  <Text>Thành tiền: {formatCurrency(order.playTime.totalPrice)}</Text>
                </VStack>
                <Divider />
              </>
            )}

            <VStack align="stretch" spacing={2}>
              <HStack justify="space-between">
                <Text>Tổng tiền:</Text>
                <Text fontWeight="bold">{formatCurrency(order.totalPrice)}</Text>
              </HStack>
              <HStack justify="space-between">
                <Text>Giảm giá:</Text>
                <Text>{formatCurrency(order.discount)}</Text>
              </HStack>
              <HStack justify="space-between">
                <Text>Khách trả:</Text>
                <Text>{formatCurrency(order.customerPay)}</Text>
              </HStack>
              <HStack justify="space-between">
                <Text>Tiền thừa:</Text>
                <Text>{formatCurrency(order.excessCash)}</Text>
              </HStack>
            </VStack>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};