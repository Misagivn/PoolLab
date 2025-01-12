'use client';

import {
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useToast,
  Stack,
  Text,
  Badge,
} from '@chakra-ui/react';
import { useEffect, useState, useRef } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiRefreshCcw } from 'react-icons/fi';
import { BilliardPrice } from '@/utils/types/table.types';
import { billiardPriceApi } from '@/apis/billiard-price.api';
import { BilliardPriceFormModal } from '@/components/billiardTable/BilliardPriceFormModal';

export default function BilliardPricePage() {
  const [prices, setPrices] = useState<BilliardPrice[]>([]);
  const [selectedPrice, setSelectedPrice] = useState<BilliardPrice | null>(null);
  const [loading, setLoading] = useState(true);
  const [priceToDelete, setPriceToDelete] = useState<BilliardPrice | null>(null);

  const { 
    isOpen: isFormOpen, 
    onOpen: onFormOpen, 
    onClose: onFormClose 
  } = useDisclosure();
  
  const { 
    isOpen: isDeleteOpen, 
    onOpen: onDeleteOpen, 
    onClose: onDeleteClose 
  } = useDisclosure();

  const cancelRef = useRef(null);
  const toast = useToast();

  const fetchPrices = async () => {
    try {
      setLoading(true);
      const response = await billiardPriceApi.getAllPrices();
      if (response.status === 200) {
        setPrices(response.data);
      }
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Không thể tải danh sách giá',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
  }, []);

  const handleAddPrice = async (data: Omit<BilliardPrice, 'id' | 'status'>) => {
    try {
      const response = await billiardPriceApi.createPrice(data);
      if (response.status === 200) {
        toast({
          title: 'Thành công',
          description: 'Thêm giá mới thành công',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        fetchPrices();
      }
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Không thể thêm giá mới',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleUpdatePrice = async (data: Omit<BilliardPrice, 'id' | 'status'>) => {
    if (!selectedPrice) return;
    try {
      const response = await billiardPriceApi.updatePrice(selectedPrice.id, data);
      if (response.status === 200) {
        toast({
          title: 'Thành công',
          description: 'Cập nhật giá thành công',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        fetchPrices();
      }
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Không thể cập nhật giá',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDeletePrice = async () => {
    if (!priceToDelete) return;
    try {
      const response = await billiardPriceApi.deletePrice(priceToDelete.id);
      if (response.status === 200) {
        toast({
          title: 'Thành công',
          description: 'Xóa giá thành công',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        fetchPrices();
        onDeleteClose();
      }
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Không thể xóa giá',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  return (
    <Box p={6}>
      <Stack spacing={6}>
        {/* Header */}
        <Flex justify="space-between" align="center">
          <Heading size="lg">Quản lý giá</Heading>
          <Button
            leftIcon={<Icon as={FiPlus} />}
            colorScheme="blue"
            onClick={() => {
              setSelectedPrice(null);
              onFormOpen();
            }}
          >
            Thêm giá mới
          </Button>
        </Flex>

        {/* Prices Table */}
        <Table variant="simple" bg="white" boxShadow="sm" rounded="lg">
          <Thead bg="gray.50">
            <Tr>
              <Th>TÊN</Th>
              <Th>MÔ TẢ</Th>
              <Th>GIÁ TIỀN</Th>
              <Th>THỜI GIAN BẮT ĐẦU</Th>
              <Th>THỜI GIAN KẾT THÚC</Th>
              <Th>TRẠNG THÁI</Th>
              <Th width="100px" textAlign="right">THAO TÁC</Th>
            </Tr>
          </Thead>
          <Tbody>
            {prices.map((price) => (
              <Tr key={price.id}>
                <Td fontWeight="medium">{price.name}</Td>
                <Td>{price.descript || '-'}</Td>
                <Td>{formatPrice(price.oldPrice)}</Td>
                <Td>{formatDateTime(price.timeStart)}</Td>
                <Td>{formatDateTime(price.timeEnd)}</Td>
                <Td>
                <Badge colorScheme="green">
                    {price.status}
                  </Badge>
                </Td>
                <Td>
                  <Flex justify="flex-end" gap={2}>
                    <IconButton
                      aria-label="Edit"
                      icon={<Icon as={FiEdit2} />}
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setSelectedPrice(price);
                        onFormOpen();
                      }}
                    />
                    <IconButton
                      aria-label="Delete"
                      icon={<Icon as={FiTrash2} />}
                      size="sm"
                      variant="ghost"
                      colorScheme="red"
                      onClick={() => {
                        setPriceToDelete(price);
                        onDeleteOpen();
                      }}
                    />
                  </Flex>
                </Td>
              </Tr>
            ))}

            {prices.length === 0 && !loading && (
              <Tr>
                <Td colSpan={7}>
                  <Flex 
                    direction="column" 
                    align="center" 
                    justify="center" 
                    py={10}
                  >
                    <Text color="gray.500" mb={4}>
                      Chưa có giá nào
                    </Text>
                    <Button
                      leftIcon={<Icon as={FiRefreshCcw} />}
                      onClick={fetchPrices}
                    >
                      Tải lại
                    </Button>
                  </Flex>
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </Stack>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        isOpen={isDeleteOpen}
        leastDestructiveRef={cancelRef}
        onClose={onDeleteClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Xóa giá
            </AlertDialogHeader>

            <AlertDialogBody>
              Bạn có chắc chắn muốn xóa giá "{priceToDelete?.name}"? 
              Hành động này không thể hoàn tác.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onDeleteClose}>
                Hủy
              </Button>
              <Button colorScheme="red" onClick={handleDeletePrice} ml={3}>
                Xóa
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      {/* Form Modal */}
      <BilliardPriceFormModal
        isOpen={isFormOpen}
        onClose={() => {
          onFormClose();
          setSelectedPrice(null);
        }}
        onSubmit={selectedPrice ? handleUpdatePrice : handleAddPrice}
        initialData={selectedPrice}
        title={selectedPrice ? 'Chỉnh sửa giá' : 'Thêm giá mới'}
      />
    </Box>
  );
}