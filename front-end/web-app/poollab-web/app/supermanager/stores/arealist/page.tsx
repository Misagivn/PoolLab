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
  Button,
  Icon,
  useDisclosure,
  Badge,
  Avatar,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from '@chakra-ui/react';
import { useState, useEffect, useRef } from 'react';
import { 
  FiSearch, 
  FiRefreshCcw,
  FiEdit2,
  FiInfo,
  FiPlus,
  FiMapPin,
  FiStar,
  FiTrash2,
} from 'react-icons/fi';
import { useStores } from '@/hooks/useStores';
import { StoreDetailModal } from '@/components/store/StoreDetailModal';
import { StoreFormModal } from '@/components/store/StoreFormModal';
import { Store } from '@/utils/types/store';
import { ProductPagination } from '@/components/common/paginations';

export default function StorePage() {
  const { 
    data: stores, 
    loading,
    pagination,
    fetchStores, 
    createStore,
    updateStore,
    deleteStore,
  } = useStores();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const cancelRef = useRef(null);
  const [storeToDelete, setStoreToDelete] = useState<Store | null>(null);
  const { 
    isOpen: isDeleteOpen, 
    onOpen: onDeleteOpen, 
    onClose: onDeleteClose 
  } = useDisclosure();

  // Modals state
  const { 
    isOpen: isDetailOpen, 
    onOpen: onDetailOpen, 
    onClose: onDetailClose 
  } = useDisclosure();
  
  const { 
    isOpen: isFormOpen, 
    onOpen: onFormOpen, 
    onClose: onFormClose 
  } = useDisclosure();

  useEffect(() => {
    fetchStores(1);
  }, [fetchStores]);

  const handlePageChange = (page: number) => {
    fetchStores(page);
  };

  const handleAddStore = async (data: Partial<Store>) => {
    try {
      await createStore(data as Omit<Store, 'id' | 'rated' | 'createdDate' | 'updatedDate' | 'status' | 'companyId'>);
      onFormClose();
    } catch (error) {
      console.error('Error adding store:', error);
    }
  };

  const handleUpdateStore = async (data: Partial<Store>) => {
    if (!selectedStore) return;
    try {
      await updateStore(selectedStore.id, data as Omit<Store, 'id' | 'rated' | 'createdDate' | 'updatedDate' | 'status' | 'companyId'>);
      onFormClose();
      setSelectedStore(null);
    } catch (error) {
      console.error('Error updating store:', error);
    }
  };

  const handleDeleteStore = async () => {
    if (!storeToDelete) return;
    try {
      await deleteStore(storeToDelete.id);
      onDeleteClose();
      setStoreToDelete(null);
    } catch (error) {
      console.error('Error deleting store:', error);
    }
  };

  const filteredStores = (stores || []).filter(store => 
    store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    store.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
    store.phoneNumber.includes(searchQuery)
  );

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'green';
    if (rating >= 4.0) return 'blue';
    if (rating >= 3.0) return 'yellow';
    return 'gray';
  };

  if (loading) {
    return (
      <Flex h="100%" align="center" justify="center" p={6}>
        <Spinner size="xl" color="blue.500" />
      </Flex>
    );
  }

  return (
    <Box p={{ base: 4, md: 6 }}>
      <Stack spacing={6}>
        {/* Header */}
        <Flex direction={{ base: 'column', sm: 'row' }} justify="space-between" align={{ base: 'stretch', sm: 'center' }} gap={4}>
          <Heading size={{ base: "md", md: "lg" }}>Quản lý cửa hàng</Heading>
          <Button
            leftIcon={<Icon as={FiPlus} />}
            colorScheme="blue"
            onClick={onFormOpen}
            w={{ base: "full", sm: "auto" }}
          >
            Thêm cửa hàng
          </Button>
        </Flex>

        {/* Search and Refresh */}
        <HStack spacing={4}>
          <InputGroup maxW="320px">
            <InputLeftElement>
              <Icon as={FiSearch} color="gray.400" />
            </InputLeftElement>
            <Input
              placeholder="Tìm kiếm cửa hàng..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </InputGroup>

          <IconButton
            aria-label="Refresh"
            icon={<Icon as={FiRefreshCcw} />}
            onClick={() => {
              setSearchQuery('');
              fetchStores(1);
            }}
          />
        </HStack>

        {/* Stores Table */}
        <Table variant="simple" bg="white" boxShadow="sm" rounded="lg">
          <Thead bg="gray.50">
            <Tr>
              <Th>CỬA HÀNG</Th>
              <Th>LIÊN HỆ</Th>
              <Th>ĐÁNH GIÁ</Th>
              <Th>TRẠNG THÁI</Th>
              <Th width="100px" textAlign="right">THAO TÁC</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredStores.map((store) => (
              <Tr key={store.id}>
                <Td>
                  <HStack spacing={3}>
                    <Avatar 
                      size="md" 
                      name={store.name} 
                      src={store.storeImg} 
                    />
                    <Box>
                      <Text fontWeight="medium">{store.name}</Text>
                      <HStack color="gray.600" fontSize="sm">
                        <Icon as={FiMapPin} />
                        <Text>{store.address}</Text>
                      </HStack>
                    </Box>
                  </HStack>
                </Td>
                <Td>
                  <Text>{store.phoneNumber}</Text>
                  <Text fontSize="sm" color="gray.600">
                    {store.timeStart && store.timeEnd ? 
                      `${store.timeStart} - ${store.timeEnd}` : 
                      'Chưa cập nhật giờ mở cửa'}
                  </Text>
                </Td>
                <Td>
                  <HStack>
                    <Icon as={FiStar} color={`${getRatingColor(store.rated)}.400`} />
                    <Text fontWeight="medium">{store.rated.toFixed(1)}</Text>
                  </HStack>
                </Td>
                <Td>
                  <Badge 
                    colorScheme={store.status === 'Hoạt Động' ? 'green' : 'red'}
                  >
                    {store.status}
                  </Badge>
                </Td>
                <Td>
                  <HStack spacing={2} justify="flex-end">
                    <IconButton
                      aria-label="View details"
                      icon={<Icon as={FiInfo} />}
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setSelectedStore(store);
                        onDetailOpen();
                      }}
                    />
                    <IconButton
                      aria-label="Edit store"
                      icon={<Icon as={FiEdit2} />}
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setSelectedStore(store);
                        onFormOpen();
                      }}
                    />
                    <IconButton
                      aria-label="Delete store"
                      icon={<Icon as={FiTrash2} />}
                      size="sm"
                      variant="ghost"
                      colorScheme="red"
                      onClick={() => {
                        setStoreToDelete(store);
                        onDeleteOpen();
                      }}
                    />
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>

        {/* Pagination */}
        {!searchQuery && filteredStores.length > 0 && (
          <ProductPagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
            loading={loading}
          />
        )}

        {/* Empty State */}
        {filteredStores.length === 0 && (
          <Flex 
            direction="column" 
            align="center" 
            justify="center" 
            py={10}
            bg="gray.50"
            borderRadius="lg"
          >
            <Icon as={FiMapPin} fontSize="3xl" color="gray.400" mb={2} />
            <Text color="gray.500">
              Không tìm thấy cửa hàng nào
            </Text>
            <Button
              mt={4}
              size="sm"
              leftIcon={<Icon as={FiRefreshCcw} />}
              onClick={() => {
                setSearchQuery('');
                fetchStores(1);
              }}
            >
              Đặt lại bộ lọc
            </Button>
          </Flex>
        )}

        {/* Delete Confirmation Dialog */}
        <AlertDialog
          isOpen={isDeleteOpen}
          leastDestructiveRef={cancelRef}
          onClose={onDeleteClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Xóa cửa hàng
              </AlertDialogHeader>

              <AlertDialogBody>
                Bạn có chắc chắn muốn xóa cửa hàng "{storeToDelete?.name}"? 
                Hành động này không thể hoàn tác.
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onDeleteClose}>
                  Hủy
                </Button>
                <Button colorScheme="red" onClick={handleDeleteStore} ml={3}>
                  Xóa
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>

        {/* Store Detail Modal */}
        <StoreDetailModal
          isOpen={isDetailOpen}
          onClose={onDetailClose}
          store={selectedStore}
        />

        {/* Store Form Modal */}
        <StoreFormModal
          isOpen={isFormOpen}
          onClose={() => {
            onFormClose();
            setSelectedStore(null);
          }}
          onSubmit={selectedStore ? handleUpdateStore : handleAddStore}
          initialData={selectedStore}
          title={selectedStore ? 'Chỉnh sửa cửa hàng' : 'Thêm cửa hàng mới'}
        />
      </Stack>
    </Box>
  );
}