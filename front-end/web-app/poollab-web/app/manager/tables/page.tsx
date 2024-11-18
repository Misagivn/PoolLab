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
  Icon,
  Card,
  CardBody,
  Image,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { 
  FiSearch, 
  FiRefreshCcw,
  FiEdit2,
  FiTrash2,
  FiInfo,
  FiPlusSquare,
} from 'react-icons/fi';

interface BilliardTable {
  id: string;
  name: string;
  descript: string;
  image: string;
  storeId: string;
  areaId: string;
  billiardTypeId: string;
  qrcode: string;
  priceId: string;
  createdDate: string;
  updatedDate: string | null;
  status: string;
}

export default function TablesPage() {
  const [tables, setTables] = useState<BilliardTable[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const toast = useToast();

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');

        const decoded = jwtDecode(token) as any;
        const storeId = decoded.storeId;

        const response = await fetch(
          `https://poollabwebapi20241008201316.azurewebsites.net/api/BilliardTable/GetAllBilliardTable?StroreID=${storeId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = await response.json();
        if (data.status === 200) {
          setTables(data.data.items);
        }
      } catch (err) {
        toast({
          title: 'Lỗi',
          description: 'Không thể tải danh sách bàn',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTables();
  }, [toast]);

  const filteredTables = tables.filter(table => {
    const matchesSearch = table.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (filter === 'all') return matchesSearch;
    return matchesSearch && table.status.toLowerCase() === filter.toLowerCase();
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  if (loading) {
    return (
      <Flex h="100%" align="center" justify="center" p={6}>
        <Spinner size="xl" color="blue.500" />
      </Flex>
    );
  }

  return (
    <Box p={6} bg="gray.50" minH="100vh">
      <Stack spacing={6}>
        {/* Header with Add Button */}
        <Flex justify="space-between" align="center">
          <Heading size="lg">Quản lý bàn Billiard</Heading>
          <Button
            leftIcon={<Icon as={FiPlusSquare} />}
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
            Thêm bàn mới
          </Button>
        </Flex>

        {/* Search Bar and Actions */}
        <Flex gap={4} wrap="wrap">
          <InputGroup maxW={{ base: "100%", md: "320px" }}>
            <InputLeftElement>
              <Icon as={FiSearch} color="gray.400" />
            </InputLeftElement>
            <Input
              bg="white"
              placeholder="Tìm kiếm bàn..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </InputGroup>

          <Select
            w={{ base: "100%", md: "200px" }}
            bg="white"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="bàn trống">Bàn trống</option>
            <option value="đang sử dụng">Đang sử dụng</option>
            <option value="đang bảo trì">Đang bảo trì</option>
          </Select>

          <IconButton
            aria-label="Refresh"
            icon={<Icon as={FiRefreshCcw} />}
            onClick={() => window.location.reload()}
          />
        </Flex>

        {/* Status Legend */}
        <HStack spacing={4} bg="white" p={4} borderRadius="lg" flexWrap="wrap">
          <HStack>
            <Badge colorScheme="green">BÀN TRỐNG</Badge>
            <Text fontSize="sm">Sẵn sàng</Text>
          </HStack>
          <HStack>
            <Badge colorScheme="red">ĐANG SỬ DỤNG</Badge>
            <Text fontSize="sm">Có khách</Text>
          </HStack>
          <HStack>
            <Badge colorScheme="yellow">ĐANG BẢO TRÌ</Badge>
            <Text fontSize="sm">Bảo trì</Text>
          </HStack>
        </HStack>

        {/* Table Card */}
        <Card>
          <CardBody p={0}>
            <Table variant="simple">
              <Thead bg="gray.50">
                <Tr>
                  <Th width="50px">STT</Th>
                  <Th width="100px">HÌNH ẢNH</Th>
                  <Th>TÊN BÀN</Th>
                  <Th>LOẠI BÀN</Th>
                  <Th>NGÀY TẠO</Th>
                  <Th>NGÀY CẬP NHẬT</Th>
                  <Th>TRẠNG THÁI</Th>
                  <Th width="100px" textAlign="right">THAO TÁC</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredTables.map((table, index) => (
                  <Tr key={table.id}>
                    <Td>{index + 1}</Td>
                    <Td>
                      <Image
                        src={table.image || '/api/placeholder/100/100'}
                        alt={table.name}
                        boxSize="50px"
                        objectFit="cover"
                        borderRadius="md"
                      />
                    </Td>
                    <Td>{table.name}</Td>
                    <Td>{table.billiardTypeId}</Td>
                    <Td>{formatDate(table.createdDate)}</Td>
                    <Td>{table.updatedDate ? formatDate(table.updatedDate) : '-'}</Td>
                    <Td>
                      <Badge
                        colorScheme={
                          table.status.toLowerCase() === 'bàn trống' ? 'green' :
                          table.status.toLowerCase() === 'đang sử dụng' ? 'red' :
                          'yellow'
                        }
                      >
                        {table.status}
                      </Badge>
                    </Td>
                    <Td>
                      <HStack spacing={2} justify="flex-end">
                        <IconButton
                          aria-label="View details"
                          icon={<Icon as={FiInfo} />}
                          size="sm"
                          variant="ghost"
                        />
                        <IconButton
                          aria-label="Edit table"
                          icon={<Icon as={FiEdit2} />}
                          size="sm"
                          variant="ghost"
                        />
                        <IconButton
                          aria-label="Delete table"
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

            {filteredTables.length === 0 && (
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