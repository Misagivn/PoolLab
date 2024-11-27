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
  Select,
  HStack,
  IconButton,
  Button,
  Avatar,
  Icon,
  useDisclosure,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { 
  FiSearch, 
  FiRefreshCcw,
  FiUserPlus,
  FiInfo,
  FiEdit2
} from 'react-icons/fi';
import { useStaff } from '@/hooks/useStaff';
import { StaffFormModal } from '@/components/staff/StaffFormModal';
import { StaffDetailModal } from '@/components/staff/StaffDetailModal';
import { UpdateStaffModal } from '@/components/staff/UpdateStaffModal';
import { Staff } from '@/utils/types/staff.types';

export default function StaffPage() {
  const { 
    staff, 
    loading, 
    fetchStaff, 
    selectedStaff,
    selectStaff,
    getWorkingStatus 
  } = useStaff();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  
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

  const {
    isOpen: isUpdateOpen,
    onOpen: onUpdateOpen,
    onClose: onUpdateClose
  } = useDisclosure();

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  useEffect(() => {
    // Reset to first page when search query or filter changes
    setCurrentPage(1);
  }, [searchQuery, filter]);

  const filteredStaff = staff
    .sort((a, b) => new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime())
    .filter(member => {
      const searchString = searchQuery.toLowerCase();
      const matchesSearch = 
        member.fullName.toLowerCase().includes(searchString) ||
        member.email.toLowerCase().includes(searchString) ||
        member.phoneNumber?.toLowerCase().includes(searchString);
      
      if (filter === 'all') return matchesSearch;
      return matchesSearch && getWorkingStatus(member.status).toLowerCase() === filter.toLowerCase();
    });

  // Pagination calculations
  const totalPages = Math.ceil(filteredStaff.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedStaff = filteredStaff.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRefresh = () => {
    setSearchQuery('');
    setFilter('all');
    setCurrentPage(1);
    fetchStaff();
  };

  if (loading) {
    return (
      <Flex h="100%" align="center" justify="center" p={6}>
        <Spinner size="xl" color="blue.500" />
      </Flex>
    );
  }

  return (
    <Box p={6}>
      <Stack spacing={6}>
        {/* Header */}
        <Flex justify="space-between" align="center">
          <Heading size="lg">Quản lý nhân viên</Heading>
          <Button
            leftIcon={<Icon as={FiUserPlus} />}
            colorScheme="blue"
            onClick={onFormOpen}
          >
            Thêm nhân viên
          </Button>
        </Flex>

        {/* Search and Filter */}
        <HStack spacing={4}>
          <InputGroup maxW="320px">
            <InputLeftElement>
              <Icon as={FiSearch} color="gray.400" />
            </InputLeftElement>
            <Input
              placeholder="Tìm kiếm nhân viên..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </InputGroup>

          <Select
            w="200px"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="đang làm việc">Đang làm việc</option>
            <option value="đã nghỉ việc">Đã nghỉ việc</option>
          </Select>

          <IconButton
            aria-label="Refresh"
            icon={<Icon as={FiRefreshCcw} />}
            onClick={handleRefresh}
          />
        </HStack>

        {/* Table */}
        <Box overflowX="auto">
          <Table variant="simple" bg="white">
            <Thead bg="gray.50">
              <Tr>
                <Th width="80px" textAlign="center">STT</Th>
                <Th>NHÂN VIÊN</Th>
                <Th>EMAIL</Th>
                <Th>SỐ ĐIỆN THOẠI</Th>
                <Th>TRẠNG THÁI</Th>
                <Th width="100px" textAlign="right">THAO TÁC</Th>
              </Tr>
            </Thead>
            <Tbody>
              {paginatedStaff.map((member, index) => (
                <Tr key={member.id}>
                  <Td textAlign="center">{startIndex + index + 1}</Td>
                  <Td>
                    <HStack spacing={3}>
                      <Avatar 
                        size="sm" 
                        name={member.fullName}
                        src={member.avatarUrl || undefined}
                      />
                      <Box>
                        <Text fontWeight="medium">{member.fullName}</Text>
                        <Text fontSize="sm" color="gray.500">{member.userName}</Text>
                      </Box>
                    </HStack>
                  </Td>
                  <Td>{member.email}</Td>
                  <Td>{member.phoneNumber || "Chưa cập nhật"}</Td>
                  <Td>
                    <Badge
                      colorScheme={member.status === 'Kích hoạt' ? 'green' : 'red'}
                    >
                      {getWorkingStatus(member.status)}
                    </Badge>
                  </Td>
                  <Td>
                    <HStack spacing={2} justify="flex-end">
                      <IconButton
                        aria-label="Edit staff"
                        icon={<Icon as={FiEdit2} />}
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          selectStaff(member);
                          onUpdateOpen();
                        }}
                      />
                      <IconButton
                        aria-label="View details"
                        icon={<Icon as={FiInfo} />}
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          selectStaff(member);
                          onDetailOpen();
                        }}
                      />
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>

        {filteredStaff.length === 0 ? (
          <Flex 
            direction="column" 
            align="center" 
            justify="center" 
            py={10}
            bg="gray.50"
            borderRadius="lg"
          >
            <Text color="gray.500">
              Không tìm thấy nhân viên nào
            </Text>
            <Button
              mt={4}
              size="sm"
              onClick={handleRefresh}
            >
              Đặt lại bộ lọc
            </Button>
          </Flex>
        ) : (
          <Flex justify="center" mt={4}>
            <HStack>
              <Button
                size="sm"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                Trước
              </Button>
              <Text>
                Trang {currentPage} / {totalPages}
              </Text>
              <Button
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Sau
              </Button>
            </HStack>
          </Flex>
        )}

        {/* Modals */}
        <StaffFormModal
          isOpen={isFormOpen}
          onClose={onFormClose}
        />

        <StaffDetailModal
          isOpen={isDetailOpen}
          onClose={onDetailClose}
          staff={selectedStaff}
        />

        <UpdateStaffModal 
          isOpen={isUpdateOpen}
          onClose={onUpdateClose}
          staff={selectedStaff}
        />
      </Stack>
    </Box>
  );
}