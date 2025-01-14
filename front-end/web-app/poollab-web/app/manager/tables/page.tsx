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
  Image,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';
import { useEffect, useState, useRef } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiRefreshCcw, FiSearch, FiEye } from 'react-icons/fi';
import { BilliardTable, BilliardTableFormData } from '@/utils/types/table.types';
import { billiardTableApi } from '@/apis/table.api';
import { BilliardTableFormModal } from '@/components/billiardTablesupdate/BilliardTableFormModal';
import { BilliardTableDetailModal } from '@/components/billiardTablesupdate/BilliardTableDetailModal';
import { TableStatusModal } from '@/components/billiardTablesupdate/tableStatusModal';
import { ProductPagination } from '@/components/common/paginations';
import { useBilliardTable } from '@/hooks/useTable';
import { useArea } from '@/hooks/useArea';
import { useBilliardType } from '@/hooks/useBilliardType';
import { useBilliardPrice } from '@/hooks/useBilliardPrice';
import { jwtDecode } from 'jwt-decode';
import { JWTPayload } from '@/utils/types/area.types';

export default function BilliardTablePage() {
  const {
    tables,
    loading,
    pagination,
    fetchTables,
  } = useBilliardTable();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTable, setSelectedTable] = useState<BilliardTable | null>(null);
  const [tableToDelete, setTableToDelete] = useState<BilliardTable | null>(null);
  const [selectedDetailTable, setSelectedDetailTable] = useState<BilliardTable | null>(null);

  const { areas, fetchAreas } = useArea();
  const { types, fetchTypes } = useBilliardType();
  const { prices, fetchPrices } = useBilliardPrice();

  const {
    isOpen: isStatusOpen,
    onOpen: onStatusOpen,
    onClose: onStatusClose
  } = useDisclosure();

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

  const {
    isOpen: isDetailOpen,
    onOpen: onDetailOpen,
    onClose: onDetailClose
  } = useDisclosure();

  const cancelRef = useRef(null);
  const toast = useToast();

  useEffect(() => {
    fetchTables(1);
    fetchAreas();
    fetchTypes();
    fetchPrices();
  }, [fetchTables, fetchAreas, fetchTypes, fetchPrices]);

  // Fetch new data when search changes
  useEffect(() => {
    fetchTables(1);
  }, [searchQuery, fetchTables]);

  const handleAddTable = async (data: Omit<BilliardTableFormData, 'id'>) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');
  
      const decoded = jwtDecode(token) as JWTPayload;
      
      const tableData = {
        ...data,
        storeId: decoded.storeId
      };
  
      const response = await billiardTableApi.createTable(tableData);
  
      if (response.status === 200) {
        toast({
          title: 'Thành công',
          description: 'Thêm bàn mới thành công',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        fetchTables(pagination.currentPage);
      }
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Không thể thêm bàn mới',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleUpdateTable = async (data: Omit<BilliardTable, 'id' | 'status'>) => {
    if (!selectedTable) return;
    try {
      const response = await billiardTableApi.updateTable(selectedTable.id, data);
      if (response.status === 200) {
        toast({
          title: 'Thành công',
          description: 'Cập nhật bàn thành công',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        fetchTables(pagination.currentPage);
      }
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Không thể cập nhật bàn',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDeleteTable = async () => {
    if (!tableToDelete) return;
    try {
      const response = await billiardTableApi.deleteTable(tableToDelete.id);
      if (response.status === 200) {
        toast({
          title: 'Thành công',
          description: 'Xóa bàn thành công',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        fetchTables(pagination.currentPage);
        onDeleteClose();
      }
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Không thể xóa bàn',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleRefresh = () => {
    setSearchQuery('');
    fetchTables(1);
  };

  const filteredTables = tables.filter(table => 
    table.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    table.areaName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    table.bidaTypeName.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
    <Box p={6}>
      <Stack spacing={6}>
        {/* Header */}
        <Flex justify="space-between" align="center">
          <Heading size="lg">Quản lý bàn bi-a</Heading>
          <Button
            leftIcon={<Icon as={FiPlus} />}
            colorScheme="blue"
            onClick={() => {
              setSelectedTable(null);
              onFormOpen();
            }}
          >
            Thêm bàn mới
          </Button>
        </Flex>

        {/* Search */}
        <HStack spacing={4}>
          <InputGroup maxW="320px">
            <InputLeftElement>
              <Icon as={FiSearch} color="gray.400" />
            </InputLeftElement>
            <Input
              placeholder="Tìm kiếm bàn..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </InputGroup>

          <IconButton
            aria-label="Refresh"
            icon={<Icon as={FiRefreshCcw} />}
            onClick={handleRefresh}
          />
        </HStack>

        {/* Tables Table */}
        <Table variant="simple" bg="white" boxShadow="sm" rounded="lg">
          <Thead bg="gray.50">
            <Tr>
              <Th width="50px">STT</Th>
              <Th>TÊN BÀN</Th>
              <Th>HÌNH ẢNH</Th>
              <Th>KHU VỰC</Th>
              <Th>LOẠI BÀN</Th>
              <Th>GIÁ</Th>
              <Th>TRẠNG THÁI</Th>
              <Th>NGÀY TẠO</Th>
              <Th width="100px" textAlign="right">THAO TÁC</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredTables.map((table, index) => (
              <Tr key={table.id}>
                <Td>{(pagination.currentPage - 1) * pagination.pageSize + index + 1}</Td>
                <Td fontWeight="medium">{table.name}</Td>
                <Td>
                  {table.image ? (
                    <Image
                      src={table.image}
                      alt={table.name}
                      boxSize="40px"
                      objectFit="cover"
                      borderRadius="md"
                    />
                  ) : (
                    <Box 
                      w="40px" 
                      h="40px" 
                      bg="gray.100" 
                      borderRadius="md" 
                      display="flex" 
                      alignItems="center" 
                      justifyContent="center"
                    >
                      <Text color="gray.400" fontSize="sm">N/A</Text>
                    </Box>
                  )}
                </Td>
                <Td>{table.areaName}</Td>
                <Td>{table.bidaTypeName}</Td>
                <Td>{formatPrice(table.oldPrice)}</Td>
                <Td>
                  <Badge
                    colorScheme={
                      table.status === 'Có Khách'
                        ? 'red'
                        : table.status === 'Bàn Trống'
                        ? 'green'
                        : 'yellow'
                    }
                  >
                    {table.status}
                  </Badge>
                </Td>
                <Td>{formatDateTime(table.createdDate)}</Td>
                <Td>
                  <Flex justify="flex-end" gap={2}>
                    <IconButton
                      aria-label="View details"
                      icon={<Icon as={FiEye} />}
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setSelectedDetailTable(table);
                        onDetailOpen();
                      }}
                    />
                    <IconButton
                      aria-label="Edit"
                      icon={<Icon as={FiEdit2} />}
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setSelectedTable(table);
                        onFormOpen();
                      }}
                    />
                    <IconButton
                      aria-label="Change status"
                      icon={<Icon as={FiRefreshCcw} />}
                      size="sm"
                      variant="ghost"
                      colorScheme={table.status === 'Có Khách' ? 'red' : 'green'}
                      onClick={() => {
                        setSelectedTable(table);
                        onStatusOpen();
                      }}
                    />
                    <IconButton
                      aria-label="Delete"
                      icon={<Icon as={FiTrash2} />}
                      size="sm"
                      variant="ghost"
                      colorScheme="red"
                      onClick={() => {
                        setTableToDelete(table);
                        onDeleteOpen();
                      }}
                    />
                  </Flex>
                </Td>
              </Tr>
            ))}

            {filteredTables.length === 0 && (
              <Tr>
                <Td colSpan={9}>
                  <Flex 
                    direction="column" 
                    align="center" 
                    justify="center" 
                    py={10}
                  >
                    <Text color="gray.500" mb={4}>
                      Chưa có bàn nào
                    </Text>
                    <Button
                      leftIcon={<Icon as={FiRefreshCcw} />}
                      onClick={handleRefresh}
                    >
                      Tải lại
                    </Button>
                  </Flex>
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>

        {/* Pagination */}
        {tables.length > 0 && (
          <ProductPagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={fetchTables}
            loading={loading}
          />
        )}
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
              Xóa bàn
            </AlertDialogHeader>

            <AlertDialogBody>
              Bạn có chắc chắn muốn xóa bàn "{tableToDelete?.name}"? 
              Hành động này không thể hoàn tác.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onDeleteClose}>
                Hủy
              </Button>
              <Button colorScheme="red" onClick={handleDeleteTable} ml={3}>
                Xóa
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      {/* Form Modal */}
      <BilliardTableFormModal
        isOpen={isFormOpen}
        onClose={() => {
          onFormClose();
          setSelectedTable(null);
        }}
        onSubmit={selectedTable ? handleUpdateTable : handleAddTable}
        initialData={selectedTable}
        title={selectedTable ? 'Chỉnh sửa bàn' : 'Thêm bàn mới'}
        areas={areas}
        types={types}
        prices={prices}
      />

      {/* Detail Modal */}
      <BilliardTableDetailModal
        isOpen={isDetailOpen}
        onClose={onDetailClose}
        table={selectedDetailTable}
      />

      <TableStatusModal
        isOpen={isStatusOpen}
        onClose={() => {
          onStatusClose();
          setSelectedTable(null);
        }}
        table={selectedTable}
        onStatusUpdate={() => fetchTables(pagination.currentPage)}
      />
    </Box>
  );
}