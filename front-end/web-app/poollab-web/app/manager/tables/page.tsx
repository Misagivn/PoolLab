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
} from '@chakra-ui/react';

import { useBilliardManager } from '@/hooks/useTable';
import { TableHeader } from '@/components/tables/TableHeader';
import { TableFiltersProps } from '@/components/tables/TableFilters';
import { StatusLegend } from '@/components/tables/StatusLegend';
import { BilliardTableRow } from '@/components/tables/BilliardTableRow';

export default function TablesPage() {
  const {
    tables,
    loading,
    filters,
    setFilters,
    deleteTable,
    refreshTables,
    selectedTable,
    detailLoading,
    fetchTableDetail
  } = useBilliardManager();

  if (loading) {
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
          onRefresh={refreshTables}
        />
        <StatusLegend />

        <Card>
          <CardBody p={0}>
            <Table variant="simple">
              <Thead bg="gray.50">
                <Tr>
                  <Th width="50px">STT</Th>
                  <Th width="100px">HÌNH ẢNH</Th>
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
                  <BilliardTableRow 
                    key={table.id} 
                    table={table} 
                    index={index}
                    onDelete={deleteTable}
                    onViewDetail={fetchTableDetail}  // Thêm prop này
                    selectedTable={selectedTable}    // Và prop này
                    detailLoading={detailLoading}   // Và prop này
                  />
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
              </Flex>
            )}
          </CardBody>
        </Card>
      </Stack>
    </Box>
  );
}