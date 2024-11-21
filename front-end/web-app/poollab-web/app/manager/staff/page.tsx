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
} from 'react-icons/fi';
import { useStaff } from '@/hooks/useStaff';
import { StaffFormModal } from '@/components/staff/StaffFormModal';
import { StaffDetailModal } from '@/components/staff/StaffDetailModal';
import { Staff } from '@/utils/types/staff.types';

export default function StaffPage() {
  const { staff, loading, fetchStaff } = useStaff();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  
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
    fetchStaff();
  }, [fetchStaff]);

  const getWorkingStatus = (status: string) => {
    return status === 'Kích hoạt' ? 'Đang làm việc' : 'Đã nghỉ việc';
  };

  const filteredStaff = staff.filter(member => {
    const searchString = searchQuery.toLowerCase();
    const matchesSearch = 
      member.fullName.toLowerCase().includes(searchString) ||
      member.email.toLowerCase().includes(searchString) ||
      member.phoneNumber?.toLowerCase().includes(searchString);
    
    if (filter === 'all') return matchesSearch;
    const status = getWorkingStatus(member.status).toLowerCase();
    return matchesSearch && status === filter.toLowerCase();
  });

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
            onClick={() => {
              setSearchQuery('');
              setFilter('all');
              fetchStaff();
            }}
          />
        </HStack>

        {/* Table */}
        <Table variant="simple" bg="white">
          <Thead bg="gray.50">
            <Tr>
              <Th>NHÂN VIÊN</Th>
              <Th>EMAIL</Th>
              <Th>SỐ ĐIỆN THOẠI</Th>
              <Th>TRẠNG THÁI</Th>
              <Th width="100px" textAlign="right">THAO TÁC</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredStaff.map((member) => (
              <Tr key={member.id}>
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
                      aria-label="View details"
                      icon={<Icon as={FiInfo} />}
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setSelectedStaff(member);
                        onDetailOpen();
                      }}
                    />
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>

        {filteredStaff.length === 0 && (
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
              onClick={() => {
                setSearchQuery('');
                setFilter('all');
              }}
            >
              Đặt lại bộ lọc
            </Button>
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
      </Stack>
    </Box>
  );
}