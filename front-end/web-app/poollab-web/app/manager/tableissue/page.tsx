'use client';

import {
  Box,
  Flex,
  Text,
  Heading,
  Badge,
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
  useDisclosure,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { 
  FiSearch, 
  FiRefreshCcw,
  FiEye,
  FiTool, 
  FiInfo
} from 'react-icons/fi';
import { useTableIssues } from '@/hooks/useTableIssues';
import { TableIssueDetailModal } from '@/components/tableIssues/TableIssueDetailModal';
import { CreateMaintenanceFormModal } from '@/components/tableMaintenance/CreateMaintenanceStatusModal';
import { ProductPagination } from '@/components/common/paginations';
import { TableIssue } from '@/utils/types/tableIssues.types';

export default function TableIssuesPage() {
  const {
    issues,
    loading,
    pagination,
    fetchIssues,
    selectedIssue,
    selectIssue,
  } = useTableIssues();

  const [searchQuery, setSearchQuery] = useState('');

  const {
    isOpen: isDetailOpen,
    onOpen: onDetailOpen,
    onClose: onDetailClose
  } = useDisclosure();

  const {
    isOpen: isMaintenanceOpen,
    onOpen: onMaintenanceOpen,
    onClose: onMaintenanceClose
  } = useDisclosure();

  useEffect(() => {
    fetchIssues(1);
  }, [fetchIssues]);

  useEffect(() => {
    if (searchQuery) {
      fetchIssues(1);
    }
  }, [searchQuery, fetchIssues]);

  const handleRefresh = () => {
    setSearchQuery('');
    fetchIssues(1);
  };

  const handleOpenMaintenance = (issue: TableIssue) => {
    selectIssue(issue);
    onMaintenanceOpen();
  };

  const handleOpenDetail = (issue: TableIssue) => {
    selectIssue(issue);
    onDetailOpen();
  };

  const filteredIssues = issues.filter(issue =>
    issue.tableIssuesCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
    issue.billiardName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    issue.reportedBy.toLowerCase().includes(searchQuery.toLowerCase())
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

  if (loading && issues.length === 0) {
    return (
      <Flex h="100%" align="center" justify="center" p={6}>
        <Spinner size="xl" color="blue.500" />
      </Flex>
    );
  }

  return (
    <Box p={6}>
      <Stack spacing={6}>
        <Flex justify="space-between" align="center">
          <Heading size="lg">Quản lý sự cố bàn</Heading>
        </Flex>

        <HStack spacing={4}>
          <InputGroup maxW="320px">
            <InputLeftElement>
              <Icon as={FiSearch} color="gray.400" />
            </InputLeftElement>
            <Input
              placeholder="Tìm kiếm sự cố..."
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
              <Th>MÃ SỰ CỐ</Th>
              <Th>TÊN BÀN</Th>
              <Th>NGƯỜI BÁO CÁO</Th>
              <Th>CHI PHÍ</Th>
              <Th>TRẠNG THÁI SỬA CHỮA</Th>
              <Th>NGÀY TẠO</Th>
              <Th width="100px" textAlign="right">THAO TÁC</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredIssues.map((issue, index) => (
              <Tr key={issue.id}>
                <Td>{(pagination.currentPage - 1) * pagination.pageSize + index + 1}</Td>
                <Td fontWeight="medium">{issue.tableIssuesCode}</Td>
                <Td>{issue.billiardName}</Td>
                <Td>{issue.reportedBy}</Td>
                <Td>{formatPrice(issue.estimatedCost)}</Td>
                <Td>
                  <Badge
                    colorScheme={issue.repairStatus === 'Hoàn Thành' ? 'green' : 'yellow'}
                  >
                    {issue.repairStatus}
                  </Badge>
                </Td>
                <Td>{formatDateTime(issue.createdDate)}</Td>
                <Td>
                  <HStack spacing={2} justify="flex-end">
                    <IconButton
                      aria-label="View details"
                      icon={<Icon as={FiInfo} />}
                      size="sm"
                      variant="ghost"
                      onClick={() => handleOpenDetail(issue)}
                    />
                    {issue.repairStatus !== 'Hoàn Thành' && (
                      <IconButton
                        aria-label="Create maintenance"
                        icon={<Icon as={FiTool} />}
                        size="sm"
                        variant="ghost"
                        colorScheme="blue"
                        onClick={() => handleOpenMaintenance(issue)}
                      />
                    )}
                  </HStack>
                </Td>
              </Tr>
            ))}

            {filteredIssues.length === 0 && (
              <Tr>
                <Td colSpan={8}>
                  <Flex 
                    direction="column" 
                    align="center" 
                    justify="center" 
                    py={10}
                  >
                    <Text color="gray.500">
                      Chưa có sự cố nào được báo cáo
                    </Text>
                  </Flex>
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>

        {issues.length > 0 && (
          <ProductPagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={fetchIssues}
            loading={loading}
          />
        )}
      </Stack>

      <TableIssueDetailModal
        isOpen={isDetailOpen}
        onClose={onDetailClose}
        issue={selectedIssue}
      />

      <CreateMaintenanceFormModal
        isOpen={isMaintenanceOpen}
        onClose={onMaintenanceClose}
        issue={selectedIssue}
      />
    </Box>
  );
}