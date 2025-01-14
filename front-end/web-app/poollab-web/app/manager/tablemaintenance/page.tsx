'use client';

import {
  Box,
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
  Stack,
  Text,
  Badge,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { FiSearch, FiRefreshCcw, FiEye, FiEdit2, FiInfo } from 'react-icons/fi';
import { useTableMaintenance } from '@/hooks/usetableMaintenance';
import { TableMaintenanceDetailModal } from '@/components/tableMaintenance/TableMaintenanceDetailModal';
import { UpdateMaintenanceStatusModal } from '@/components/tableMaintenance/UpdateMaintenanceStatusModal';
import { ProductPagination } from '@/components/common/paginations';
import { TableMaintenance } from '@/utils/types/tableMaintenance.types';

export default function TableMaintenancePage() {
  const {
    maintenanceRecords,
    loading,
    pagination,
    fetchMaintenance,
    selectedMaintenance,
    selectMaintenance,
    updateMaintenanceStatus,
  } = useTableMaintenance();

  const [searchQuery, setSearchQuery] = useState('');

  const {
    isOpen: isDetailOpen,
    onOpen: onDetailOpen,
    onClose: onDetailClose
  } = useDisclosure();

  const {
    isOpen: isStatusOpen,
    onOpen: onStatusOpen,
    onClose: onStatusClose
  } = useDisclosure();

  useEffect(() => {
    fetchMaintenance(1);
  }, [fetchMaintenance]);

  useEffect(() => {
    if (searchQuery) {
      fetchMaintenance(1);
    }
  }, [searchQuery, fetchMaintenance]);

  const handleRefresh = () => {
    setSearchQuery('');
    fetchMaintenance(1);
  };

  const handleOpenDetail = (maintenance: TableMaintenance) => {
    selectMaintenance(maintenance);
    onDetailOpen();
  };

  const handleOpenStatusUpdate = (maintenance: TableMaintenance) => {
    selectMaintenance(maintenance);
    onStatusOpen();
  };

  const handleUpdateStatus = async (status: string) => {
    if (!selectedMaintenance) return;
    await updateMaintenanceStatus(selectedMaintenance.id, status);
    onStatusClose();
  };

  const filteredRecords = maintenanceRecords.filter(record => 
    record.tableMainCode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    record.tableName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    record.staffName.toLowerCase().includes(searchQuery.toLowerCase())
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
        <Flex justify="space-between" align="center">
          <Heading size="lg">Quản lý bảo trì bàn</Heading>
        </Flex>

        <HStack spacing={4}>
          <InputGroup maxW="320px">
            <InputLeftElement>
              <Icon as={FiSearch} color="gray.400" />
            </InputLeftElement>
            <Input
              placeholder="Tìm kiếm bảo trì..."
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

        <Table variant="simple" bg="white" boxShadow="sm" rounded="lg">
          <Thead bg="gray.50">
            <Tr>
              <Th width="50px">STT</Th>
              <Th>MÃ BẢO TRÌ</Th>
              <Th>TÊN BÀN</Th>
              <Th>NHÂN VIÊN</Th>
              <Th>CHI PHÍ</Th>
              <Th>TRẠNG THÁI</Th>
              <Th>NGÀY TẠO</Th>
              <Th width="100px" textAlign="right">THAO TÁC</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredRecords.map((record, index) => (
              <Tr key={record.id}>
                <Td>{(pagination.currentPage - 1) * pagination.pageSize + index + 1}</Td>
                <Td fontWeight="medium">{record.tableMainCode}</Td>
                <Td>{record.tableName}</Td>
                <Td>{record.staffName}</Td>
                <Td>{formatPrice(record.estimatedCost)}</Td>
                <Td>
                  <Badge
                    colorScheme={record.status === 'Hoàn Thành' ? 'green' : 'yellow'}
                  >
                    {record.status}
                  </Badge>
                </Td>
                <Td>{formatDateTime(record.createdDate)}</Td>
                <Td>
                  <Flex justify="flex-end">
                    <HStack spacing={2}>
                      <IconButton
                        aria-label="View details"
                        icon={<Icon as={FiInfo} />}
                        size="sm"
                        variant="ghost"
                        onClick={() => handleOpenDetail(record)}
                      />
                      {record.status !== 'Hoàn Thành' && (
                        <IconButton
                          aria-label="Update status"
                          icon={<Icon as={FiEdit2} />}
                          size="sm"
                          variant="ghost"
                          colorScheme="blue"
                          onClick={() => handleOpenStatusUpdate(record)}
                        />
                      )}
                    </HStack>
                  </Flex>
                </Td>
              </Tr>
            ))}

            {filteredRecords.length === 0 && (
              <Tr>
                <Td colSpan={8}>
                  <Flex 
                    direction="column" 
                    align="center" 
                    justify="center" 
                    py={10}
                  >
                    <Text color="gray.500">
                      Không có bản ghi bảo trì nào
                    </Text>
                  </Flex>
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>

        {maintenanceRecords.length > 0 && (
          <ProductPagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={fetchMaintenance}
            loading={loading}
          />
        )}
      </Stack>

      <TableMaintenanceDetailModal
        isOpen={isDetailOpen}
        onClose={onDetailClose}
        maintenance={selectedMaintenance}
      />

      <UpdateMaintenanceStatusModal
        isOpen={isStatusOpen}
        onClose={onStatusClose}
        maintenance={selectedMaintenance}
        onUpdateStatus={handleUpdateStatus}
      />
    </Box>
  );
}