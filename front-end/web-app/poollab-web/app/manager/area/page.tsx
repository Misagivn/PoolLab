'use client';

import {
  Box,
  Flex,
  Text,
  Heading,
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
  HStack,
  IconButton,
  Button,
  Icon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Image,
  VStack,
} from '@chakra-ui/react';
import { useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import { 
  FiSearch, 
  FiRefreshCcw,
  FiEdit2,
  FiTrash2,
  FiMapPin,
  FiInfo,
  FiPlus,
  FiMap
} from 'react-icons/fi';

interface AreaResponse {
  status: number;
  message: string | null;
  data: Area[];
}

interface Area {
  id: string;
  name: string;
  descript: string;
  areaImg: string | null;
  storeId: string;
}

interface JWTPayload {
  storeId: string;
}

export default function AreaPage() {
  const [areas, setAreas] = useState<Area[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArea, setSelectedArea] = useState<Area | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const fetchAreas = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const decoded = jwtDecode(token) as JWTPayload;
      const storeId = decoded.storeId;

      const response = await fetch(
        'https://poollabwebapi20241008201316.azurewebsites.net/api/Area/GetAllArea',
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const data: AreaResponse = await response.json();

      if (data.status === 200) {
        // Filter areas by storeId from token
        const filteredAreas = data.data.filter(area => area.storeId === storeId);
        setAreas(filteredAreas);
      }
    } catch (err) {
      toast({
        title: 'Lỗi',
        description: 'Không thể tải danh sách khu vực',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      setAreas([]);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchAreas();
  }, [fetchAreas]);

  const filteredAreas = areas.filter(area => 
    area.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    area.descript.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <Heading size="lg">Quản lý khu vực</Heading>
          <Button
            leftIcon={<Icon as={FiPlus} />}
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
            Thêm khu vực
          </Button>
        </Flex>

        {/* Search */}
        <HStack spacing={4}>
          <InputGroup maxW="320px">
            <InputLeftElement>
              <Icon as={FiSearch} color="gray.400" />
            </InputLeftElement>
            <Input
              placeholder="Tìm kiếm khu vực..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </InputGroup>

          <IconButton
            aria-label="Refresh"
            icon={<Icon as={FiRefreshCcw} />}
            onClick={() => {
              setLoading(true);
              fetchAreas();
            }}
          />
        </HStack>

        {/* Table */}
        <Table variant="simple" bg="white">
          <Thead bg="gray.50">
            <Tr>
              <Th>TÊN KHU VỰC</Th>
              <Th>MÔ TẢ</Th>
              <Th width="100px" textAlign="right">THAO TÁC</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredAreas.map((area) => (
              <Tr key={area.id}>
                <Td>
                  <HStack spacing={3}>
                    <Icon as={FiMapPin} color="blue.500" />
                    <Text fontWeight="medium">{area.name}</Text>
                  </HStack>
                </Td>
                <Td>{area.descript || "Chưa có mô tả"}</Td>
                <Td>
                  <HStack spacing={2} justify="flex-end">
                    <IconButton
                      aria-label="View details"
                      icon={<Icon as={FiInfo} />}
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setSelectedArea(area);
                        onOpen();
                      }}
                    />
                    <IconButton
                      aria-label="Edit area"
                      icon={<Icon as={FiEdit2} />}
                      size="sm"
                      variant="ghost"
                    />
                    <IconButton
                      aria-label="Delete area"
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

        {filteredAreas.length === 0 && (
          <Flex 
            direction="column" 
            align="center" 
            justify="center" 
            py={10}
            bg="gray.50"
            borderRadius="lg"
          >
            <Icon as={FiMap} fontSize="3xl" color="gray.400" mb={2} />
            <Text color="gray.500">
              Không tìm thấy khu vực nào
            </Text>
            <Button
              mt={4}
              size="sm"
              leftIcon={<Icon as={FiRefreshCcw} />}
              onClick={() => {
                setSearchQuery('');
              }}
            >
              Đặt lại bộ lọc
            </Button>
          </Flex>
        )}

        {/* Area Detail Modal */}
        <Modal isOpen={isOpen} onClose={onClose} size="md">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Chi tiết khu vực</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              {selectedArea && (
                <Stack spacing={6}>
                  <VStack align="start" spacing={1}>
                    <Text fontWeight="bold" fontSize="xl">
                      {selectedArea.name}
                    </Text>
                    <Text color="gray.600">
                      {selectedArea.descript || "Chưa có mô tả"}
                    </Text>
                  </VStack>

                  {selectedArea.areaImg && (
                    <Box borderRadius="md" overflow="hidden">
                      <Image 
                        src={selectedArea.areaImg} 
                        alt={selectedArea.name}
                        width="100%"
                        height="auto"
                      />
                    </Box>
                  )}

                  <HStack spacing={2} justify="flex-end">
                    <Button
                      leftIcon={<Icon as={FiEdit2} />}
                      size="sm"
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
                      Chỉnh sửa
                    </Button>
                  </HStack>
                </Stack>
              )}
            </ModalBody>
          </ModalContent>
        </Modal>
      </Stack>
    </Box>
  );
}