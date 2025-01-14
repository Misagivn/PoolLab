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
  useToast,
  Stack,
  Text,
  Badge,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Button,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { FiSearch, FiRefreshCcw, FiEye } from 'react-icons/fi';
import { TableIssue } from '@/utils/types/tableIssues.types';
import { useTableIssues } from '@/hooks/useTableIssues';
import { TableIssueDetailModal } from '@/components/tableIssues/TableIssueDetailModal';
import { ProductPagination } from '@/components/common/paginations';

export default function TableIssuesPage() {
  const {
    issues,
    loading,
    pagination,
    fetchIssues,
  } = useTableIssues();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIssue, setSelectedIssue] = useState<TableIssue | null>(null);

  const {
    isOpen: isDetailOpen,
    onOpen: onDetailOpen,
    onClose: onDetailClose
  } = useDisclosure();

  useEffect(() => {
    fetchIssues(1);
  }, [fetchIssues]);

  // Fetch new data when search changes
  useEffect(() => {
    fetchIssues(1);
  }, [searchQuery, fetchIssues]);

  const handleRefresh = () => {
    setSearchQuery('');
    fetchIssues(1);
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

  return (
    <Box p={6}>
      <Stack spacing={6}>
        {/* Header */}
        <Flex justify="space-between" align="center">
          <Heading size="lg">Quản lý sự cố bàn</Heading>
        </Flex>

        {/* Search */}
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

        {/* Issues Table */}
        <Table variant="simple" bg="white" boxShadow="sm" rounded="lg">
          <Thead bg="gray.50">
            <Tr>
              <Th width="50px">STT</Th>
              <Th>MÃ SỰ CỐ</Th>
              <Th>TÊN BÀN</Th>
              <Th>NGƯỜI BÁO CÁO</Th>
              <Th>CHI PHÍ</Th>
              <Th>TRẠNG THÁI</Th>
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
                    colorScheme={issue.status === 'Thanh Toán' ? 'green' : 'yellow'}
                  >
                    {issue.status}
                  </Badge>
                </Td>
                <Td>
                  <Badge
                    colorScheme={issue.repairStatus === 'Hoàn Thành' ? 'green' : 'yellow'}
                  >
                    {issue.repairStatus}
                  </Badge>
                </Td>
                <Td>{formatDateTime(issue.createdDate)}</Td>
                <Td>
                  <Flex justify="flex-end">
                    <IconButton
                      aria-label="View details"
                      icon={<Icon as={FiEye} />}
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setSelectedIssue(issue);
                        onDetailOpen();
                      }}
                    />
                  </Flex>
                </Td>
              </Tr>
            ))}

            {filteredIssues.length === 0 && (
              <Tr>
                <Td colSpan={9}>
                  <Flex 
                    direction="column" 
                    align="center" 
                    justify="center" 
                    py={10}
                  >
                    <Text color="gray.500" mb={4}>
                      Chưa có sự cố nào được báo cáo
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
        {issues.length > 0 && (
          <ProductPagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={fetchIssues}
            loading={loading}
          />
        )}
      </Stack>

      {/* Detail Modal */}
      <TableIssueDetailModal
        isOpen={isDetailOpen}
        onClose={onDetailClose}
        issue={selectedIssue}
      />
    </Box>
  );
}