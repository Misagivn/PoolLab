'use client';

import {
  Box,
  Flex,
  Text,
  Heading,
  Badge,
  useToast,
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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Grid,
} from '@chakra-ui/react';
import { useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import { 
  FiSearch, 
  FiRefreshCcw,
  FiEdit2,
  FiTrash2,
  FiUserPlus,
  FiMail,
  FiPhone,
  FiCalendar,
  FiInfo
} from 'react-icons/fi';

interface StaffResponse {
  status: number;
  message: string | null;
  data: {
    items: Staff[];
    totalItem: number;
    pageSize: number;
    totalPages: number;
    pageNumber: number;
  };
}

interface Staff {
  id: string;
  email: string;
  avatarUrl: string;
  userName: string;
  fullName: string;
  phoneNumber: string;
  roleId: string;
  roleName: string;
  storeId: string;
  balance: number;
  joinDate: string;
  status: string;
}

export default function StaffPage() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const fetchStaff = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');
  
      // Lấy storeId từ token
      const decoded = jwtDecode(token) as any;
      const storeId = decoded.storeId;
  
      const response = await fetch(
        `https://poollabwebapi20241008201316.azurewebsites.net/api/Account/GetAllAccount?RoleId=21cfbbf3-ccd1-4394-b0e9-ee0e42564b87&StoreId=${storeId}`,
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
  
      const data: StaffResponse = await response.json();
  
      if (data.status === 200 && data.data?.items) {
        // Không cần filter vì API đã trả về staff theo storeId
        setStaff(data.data.items);
      }
    } catch (err) {
      toast({
        title: 'Lỗi',
        description: 'Không thể tải danh sách nhân viên',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      setStaff([]);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  const filteredStaff = staff.filter(member => {
    const searchString = searchQuery.toLowerCase();
    const matchesSearch = 
      member.fullName.toLowerCase().includes(searchString) ||
      member.email.toLowerCase().includes(searchString) ||
      member.phoneNumber?.toLowerCase().includes(searchString);
    
    if (filter === 'all') return matchesSearch;
    return matchesSearch && member.status.toLowerCase() === filter.toLowerCase();
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
            onClick={() => {
              toast({
                title: "Thông báo",
                description: "Tính năng sẽ sớm được cập nhật",
                status: "info",
                duration: 3000,
                isClosable: true,
              });
            }}
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
            <option value="kích hoạt">Đang làm việc</option>
            <option value="nghỉ việc">Nghỉ việc</option>
          </Select>

          <IconButton
            aria-label="Refresh"
            icon={<Icon as={FiRefreshCcw} />}
            onClick={() => {
              setLoading(true);
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
              <Th textAlign="right">THAO TÁC</Th>
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
                      src={member.avatarUrl}
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
                    {member.status}
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
                        onOpen();
                      }}
                    />
                    <IconButton
                      aria-label="Edit staff"
                      icon={<Icon as={FiEdit2} />}
                      size="sm"
                      variant="ghost"
                    />
                    <IconButton
                      aria-label="Delete staff"
                      icon={<Icon as={FiTrash2} />}
                      size="sm"
                      variant="ghost"
                      colorScheme="red"
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

        {/* Staff Detail Modal */}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Thông tin nhân viên</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              {selectedStaff && (
                <Stack spacing={4}>
                  <Flex align="center" gap={4}>
                    <Avatar
                      size="xl"
                      name={selectedStaff.fullName}
                      src={selectedStaff.avatarUrl}
                    />
                    <Box>
                      <Heading size="md">{selectedStaff.fullName}</Heading>
                      <Text color="gray.500">{selectedStaff.userName}</Text>
                      <Badge
                        mt={2}
                        colorScheme={selectedStaff.status === 'Kích hoạt' ? 'green' : 'red'}
                      >
                        {selectedStaff.status}
                      </Badge>
                    </Box>
                  </Flex>

                  <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                    <Box>
                      <HStack color="gray.600" mb={1}>
                        <Icon as={FiMail} />
                        <Text>Email</Text>
                      </HStack>
                      <Text fontWeight="medium">{selectedStaff.email}</Text>
                    </Box>

                    <Box>
                      <HStack color="gray.600" mb={1}>
                        <Icon as={FiPhone} />
                        <Text>Số điện thoại</Text>
                      </HStack>
                      <Text fontWeight="medium">
                        {selectedStaff.phoneNumber || "Chưa cập nhật"}
                      </Text>
                    </Box>

                    <Box>
                      <HStack color="gray.600" mb={1}>
                        <Icon as={FiCalendar} />
                        <Text>Ngày vào làm</Text>
                      </HStack>
                      <Text fontWeight="medium">
                        {new Date(selectedStaff.joinDate).toLocaleDateString('vi-VN')}
                      </Text>
                    </Box>
                  </Grid>
                </Stack>
              )}
            </ModalBody>
          </ModalContent>
        </Modal>
      </Stack>
    </Box>
  );
}