'use client';

import {
  Box,
  Flex,
  Text,
  Heading,
  Spinner,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  HStack,
  IconButton,
  Icon,
  Badge,
  Card,
  CardBody,
  useDisclosure,
  Tooltip,
} from '@chakra-ui/react';
import { FiSearch, FiRefreshCcw, FiExternalLink } from 'react-icons/fi';
import { useTransactions } from '@/hooks/useTransactions';
import { ProductPagination } from '@/components/common/paginations';
import { formatCurrency, formatDateTime } from '@/utils/format';
import { OrderDetailModal } from '@/components/order/OrderDetailModal';

export default function TransactionPage() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { 
    data: transactions, 
    loading,
    pagination,
    searchUsername,
    setSearchUsername,
    fetchTransactions,
    orderCodes,
    selectedOrder,
    detailLoading,
    handleViewOrder
  } = useTransactions();

  const handleRefresh = () => {
    setSearchUsername('');
    fetchTransactions(1);
  };

  if (loading && transactions.length === 0) {
    return (
      <Flex h="100vh" align="center" justify="center">
        <Spinner size="xl" color="blue.500" />
      </Flex>
    );
  }

  return (
    <Box p={6}>
      <Stack spacing={6}>
        <Heading size="lg">Quản lý giao dịch</Heading>

        <HStack>
          <InputGroup maxW="320px">
            <InputLeftElement>
              <Icon as={FiSearch} color="gray.400" />
            </InputLeftElement>
            <Input
              placeholder="Tìm kiếm"
              value={searchUsername}
              onChange={(e) => setSearchUsername(e.target.value)}
            />
          </InputGroup>

          <IconButton
            aria-label="Refresh"
            icon={<Icon as={FiRefreshCcw} />}
            onClick={handleRefresh}
            isLoading={loading}
          />
        </HStack>

        <Card>
          <CardBody p={0}>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>NGƯỜI DÙNG</Th>
                  <Th>THỜI GIAN</Th>
                  <Th>SỐ TIỀN</Th>
                  <Th>THÔNG TIN</Th>
                  <Th>TRẠNG THÁI</Th>
                </Tr>
              </Thead>
              <Tbody>
                {transactions.map((transaction) => (
                  <Tr key={transaction.id}>
                    <Td>
                      <Text fontWeight="medium">{transaction.username}</Text>
                    </Td>
                    <Td>
                      <Text>{formatDateTime(transaction.paymentDate)}</Text>
                    </Td>
                    <Td>
                      <Text 
                        fontWeight="medium"
                        color={transaction.typeCode === 1 ? "green.500" : "red.500"}
                      >
                        {transaction.typeCode === 1 ? "+" : "-"}{formatCurrency(transaction.amount)}
                      </Text>
                    </Td>
                    <Td>
                      <Text>{transaction.paymentInfo}</Text>
                      <Text fontSize="sm" color="gray.600">{transaction.paymentMethod}</Text>
                      {transaction.orderId && orderCodes[transaction.orderId] && (
                        <HStack spacing={1} mt={1}>
                          <Text fontSize="sm" color="blue.500">
                            Mã đơn: {orderCodes[transaction.orderId]}
                          </Text>
                          <Tooltip label="Xem chi tiết đơn hàng">
                            <IconButton
                              aria-label="View order details"
                              icon={<Icon as={FiExternalLink} />}
                              size="xs"
                              variant="ghost"
                              color="blue.500"
                              onClick={() => {
                                handleViewOrder(transaction.orderId);
                                onOpen();
                              }}
                            />
                          </Tooltip>
                        </HStack>
                      )}
                    </Td>
                    <Td>
                      <Badge colorScheme={transaction.status === 'Hoàn Tất' ? 'green' : 'yellow'}>
                        {transaction.status}
                      </Badge>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>

            {transactions.length === 0 && (
              <Flex
                direction="column"
                align="center"
                justify="center"
                py={10}
              >
                <Text color="gray.500">
                  Không tìm thấy giao dịch nào
                </Text>
              </Flex>
            )}
          </CardBody>
        </Card>

        {transactions.length > 0 && (
          <ProductPagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={(page) => fetchTransactions(page, searchUsername)}
            loading={loading}
          />
        )}
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