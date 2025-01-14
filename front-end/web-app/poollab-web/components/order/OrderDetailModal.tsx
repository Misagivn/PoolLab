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
  Spinner,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td
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
              {order.orderBy && (
                <Text color="gray.600">Nhân viên phục vụ: {order.orderBy}</Text>
              )}
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

            {order.orderDetails && order.orderDetails.length > 0 && (
              <>
                <VStack align="stretch" spacing={2}>
                  <Text fontWeight="bold">Chi tiết đơn hàng</Text>
                  <Table size="sm">
                    <Thead>
                      <Tr>
                        <Th>Sản phẩm</Th>
                        <Th isNumeric>Số lượng</Th>
                        <Th isNumeric>Đơn giá</Th>
                        <Th isNumeric>Thành tiền</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {order.orderDetails.map((detail) => (
                        <Tr key={detail.id}>
                          <Td>{detail.productName}</Td>
                          <Td isNumeric>{detail.quantity}</Td>
                          <Td isNumeric>{formatCurrency(detail.price)}</Td>
                          <Td isNumeric>{formatCurrency(detail.price * detail.quantity)}</Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
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
                <Text>Phí phát sinh:</Text>
                <Text>{formatCurrency(order.additionalFee || 0)}</Text>
              </HStack>
              <HStack justify="space-between">
                <Text>Số tiền cần trả:</Text>
                <Text fontWeight="bold">{formatCurrency(order.finalPrice || 0)}</Text>
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