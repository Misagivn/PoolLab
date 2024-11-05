// app/tables/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Flex,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Image,
  Badge,
  IconButton,
  Button,
  useColorModeValue,
  Skeleton,
  useToast,
  Text,
} from '@chakra-ui/react';
import { FiArrowLeft, FiEdit2, FiEye } from 'react-icons/fi';
import axios from '@/config/axios';
import { useRouter } from 'next/navigation';

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

interface ApiResponse {
  data: {
    items: BilliardTable[];
    totalItem: number;
    pageSize: number;
    totalPages: number;
    pageNumber: number;
  };
}

export default function TablesListPage() {
  const [tables, setTables] = useState<BilliardTable[]>([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const router = useRouter();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const response = await axios.get<ApiResponse>('/BilliardTable/GetAllBilliardTable');
        setTables(response.data.data.items);
      } catch (error) {
        toast({
          title: 'Error',
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

  const handleBack = () => {
    router.back();
  };

  return (
    <Box minH="100vh" bg={useColorModeValue('gray.50', 'gray.900')} p="4">
      <Container maxW="container.xl">
        {/* Header with Back Button */}
        <Flex direction="column" gap="4" mb="6">
          <Button
            leftIcon={<FiArrowLeft />}
            onClick={handleBack}
            alignSelf="flex-start"
            variant="ghost"
            size="md"
          >
            Quay lại
          </Button>
          
          <Flex justify="space-between" align="center">
            <Heading size="lg">Danh Sách Bàn Bi-a</Heading>
            <Text color="gray.500">
              Tổng số bàn: {tables.length}
            </Text>
          </Flex>
        </Flex>

        {/* Table */}
        <Box 
          bg={bgColor} 
          borderRadius="lg" 
          shadow="sm"
          overflow="hidden"
          border="1px"
          borderColor={borderColor}
        >
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Hình ảnh</Th>
                <Th>Tên bàn</Th>
                <Th>Loại bàn</Th>
                <Th>Trạng thái</Th>
                <Th>Khu vực</Th>
                <Th>Ngày tạo</Th>
                <Th>Thao tác</Th>
              </Tr>
            </Thead>
            <Tbody>
              {loading ? (
                [...Array(5)].map((_, index) => (
                  <Tr key={index}>
                    {[...Array(7)].map((_, cellIndex) => (
                      <Td key={cellIndex}>
                        <Skeleton height="20px" />
                      </Td>
                    ))}
                  </Tr>
                ))
              ) : (
                tables.map((table) => (
                  <Tr key={table.id}>
                    <Td>
                      <Image
                        src={table.image !== "string" ? table.image : "/assets/table.png"}
                        alt={table.name}
                        boxSize="50px"
                        objectFit="cover"
                        borderRadius="md"
                      />
                    </Td>
                    <Td fontWeight="medium">{table.name}</Td>
                    <Td>Bàn Pool</Td>
                    <Td>
                      <Badge 
                        colorScheme={table.status === "Bàn trống" ? "green" : "red"}
                        borderRadius="full"
                        px="2"
                      >
                        {table.status}
                      </Badge>
                    </Td>
                    <Td>Khu A</Td>
                    <Td>{new Date(table.createdDate).toLocaleDateString('vi-VN')}</Td>
                    <Td>
                      <Flex gap="2">
                        <IconButton
                          aria-label="View details"
                          icon={<FiEye />}
                          size="sm"
                          colorScheme="blue"
                          variant="ghost"
                        />
                        <IconButton
                          aria-label="Edit table"
                          icon={<FiEdit2 />}
                          size="sm"
                          colorScheme="green"
                          variant="ghost"
                        />
                      </Flex>
                    </Td>
                  </Tr>
                ))
              )}
            </Tbody>
          </Table>
        </Box>
      </Container>
    </Box>
  );
}