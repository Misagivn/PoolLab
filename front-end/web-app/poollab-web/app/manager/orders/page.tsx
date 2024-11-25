'use client';

import {
  Box,
  Stack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  IconButton,
  Icon,
  HStack,
  useDisclosure,
  Input,
  InputGroup,
  InputLeftElement,
  Flex,
  Heading,
  Spinner,
  Text,
  Card,
  CardBody
} from '@chakra-ui/react';
import { FiInfo, FiSearch, FiRefreshCcw } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { useOrder } from '@/hooks/useOrders';
import { OrderDetailModal } from '@/components/order/OrderDetailModal';
import { Pagination } from '@/components/common/Pagination';

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    orders,
    selectedOrder,
    loading,
    detailLoading,
    pagination,
    fetchOrders,
    fetchOrderDetail
  } = useOrder();

  useEffect(() => {
    fetchOrders(1);
  }, [fetchOrders]);

  const handleViewDetail = async (orderId: string) => {
    await fetchOrderDetail(orderId);
    onOpen();
  };

  const handlePageChange = (page: number) => {
    fetchOrders(page);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  };

  const filteredOrders = orders.filter(order =>
    order.orderCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <Flex h="100vh" align="center" justify="center">
        <Spinner size="xl" />
      </Flex>
    );
  }

  return (
    <Box p={6}>
      <Stack spacing={6}>
        <Heading size="lg">Quản lý đơn hàng</Heading>

        <HStack>
          <InputGroup maxW="320px">
            <InputLeftElement>
              <Icon as={FiSearch} color="gray.400" />
            </InputLeftElement>
            <Input
              placeholder="Tìm kiếm đơn hàng..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </InputGroup>

          <IconButton
            aria-label="Refresh"
            icon={<Icon as={FiRefreshCcw} />}
            onClick={() => fetchOrders(1)}
          />
        </HStack>

        <Card>
          <CardBody p={0}>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>MÃ ĐƠN</Th>
                  <Th>KHÁCH HÀNG</Th>
                  <Th>NGÀY TẠO</Th>
                  <Th isNumeric>TỔNG TIỀN</Th>
                  <Th>TRẠNG THÁI</Th>
                  <Th width="100px" textAlign="right">THAO TÁC</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredOrders.map((order) => (
                  <Tr key={order.id}>
                    <Td>{order.orderCode}</Td>
                    <Td>{order.username}</Td>
                    <Td>{formatDate(order.orderDate)}</Td>
                    <Td isNumeric>{formatCurrency(order.totalPrice)}</Td>
                    <Td>
                      <Badge colorScheme="green">
                        {order.status}
                      </Badge>
                    </Td>
                    <Td>
                      <HStack justify="flex-end">
                        <IconButton
                          aria-label="View details"
                          icon={<Icon as={FiInfo} />}
                          size="sm"
                          variant="ghost"
                          onClick={() => handleViewDetail(order.id)}
                        />
                      </HStack>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>

            {filteredOrders.length === 0 && (
              <Flex
                direction="column"
                align="center"
                justify="center"
                py={10}
                bg="gray.50"
                borderRadius="lg"
              >
                <Text color="gray.500">
                  Không tìm thấy đơn hàng nào
                </Text>
              </Flex>
            )}
          </CardBody>
        </Card>

        {/* Pagination */}
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
        />

        {/* Display total items and current page info */}
        {/* <Text textAlign="center" color="gray.600" fontSize="sm">
          Hiển thị {filteredOrders.length} / {pagination.totalItems} đơn hàng
        </Text> */}
      </Stack>

      <OrderDetailModal
        isOpen={isOpen}
        onClose={onClose}
        order={selectedOrder}
        loading={detailLoading}
      />
    </Box>
  );
}