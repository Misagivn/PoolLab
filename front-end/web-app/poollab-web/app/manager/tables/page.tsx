'use client';

import {
  Box,
  Stack,
  Spinner,
  Flex,
  Card,
  CardBody,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Text,
  Button,
} from '@chakra-ui/react';

import { useBilliardManager } from '@/hooks/useTable';
import { TableHeader } from '@/components/tables/TableHeader';
import { TableFiltersProps } from '@/components/tables/TableFilters';
import { StatusLegend } from '@/components/tables/StatusLegend';
import { BilliardTableRow } from '@/components/tables/BilliardTableRow';
import { ProductPagination } from '@/components/common/paginations';

export default function TablesPage() {
  const {
    tables,
    areas,             
    types,            
    prices,           
    loading,
    filters,
    setFilters,
    deleteTable,
    updateTable,       
    updateTableStatus, 
    refreshTables,
    selectedTable,
    detailLoading,
    fetchTableDetail,
    pagination,
    handlePageChange
  } = useBilliardManager();

  const handleRefresh = () => {
    setFilters({
      searchQuery: '',
      statusFilter: 'all'
    });
    handlePageChange(1);
  };

  if (loading && tables.length === 0) {
    return (
      <Flex h="100vh" align="center" justify="center">
        <Spinner size="xl" color="blue.500" />
      </Flex>
    );
  }

  return (
    <Box p={6} bg="gray.50" minH="100vh">
      <Stack spacing={6}>
        <TableHeader onTableCreated={refreshTables} />
        <TableFiltersProps
          filters={filters}
          onFiltersChange={setFilters}
          onRefresh={handleRefresh}
        />
        <StatusLegend />
        <Card>
          <CardBody p={0}>
            <Table variant="simple">
              <Thead bg="gray.50">
                <Tr>
                  <Th width="50px">STT</Th>
                  <Th>TÊN BÀN</Th>
                  <Th>LOẠI BÀN</Th>
                  <Th>KHU VỰC</Th>
                  <Th>NGÀY TẠO</Th>
                  <Th>NGÀY CẬP NHẬT</Th>
                  <Th>TRẠNG THÁI</Th>
                  <Th width="100px" textAlign="right">THAO TÁC</Th>
                </Tr>
              </Thead>
              <Tbody>
                {tables.map((table, index) => (
                  <Tr key={table.id}>
                    <BilliardTableRow 
                      table={table}
                      index={(pagination.currentPage - 1) * pagination.pageSize + index + 1}
                      onDelete={deleteTable}
                      onViewDetail={fetchTableDetail}
                      onUpdate={updateTable}         
                      onUpdateStatus={updateTableStatus} 
                      selectedTable={selectedTable}
                      detailLoading={detailLoading}
                      areas={areas}                   
                      types={types}                   
                      prices={prices}               
                    />
                  </Tr>
                ))}
              </Tbody>
            </Table>

            {tables.length === 0 && (
              <Flex 
                direction="column" 
                align="center" 
                justify="center" 
                py={10}
              >
                <Text color="gray.500">
                  Không tìm thấy bàn nào
                </Text>
                <Button
                  mt={4}
                  size="sm"
                  onClick={handleRefresh}
                >
                  Đặt lại bộ lọc
                </Button>
              </Flex>
            )}
          </CardBody>
        </Card>
        {tables.length > 0 && (
  <ProductPagination
    currentPage={pagination.currentPage}
    totalPages={pagination.totalPages}
    onPageChange={handlePageChange}
    loading={loading}
  />
)}

      </Stack>
    </Box>
  );
}