'use client';

import {
  Box,
  Flex,
  Text,
  Heading,
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
  useDisclosure,
  Badge,
} from '@chakra-ui/react';
import { useState } from 'react';
import { 
  FiSearch, 
  FiRefreshCcw,
  FiEdit2,
  FiInfo,
  FiPlus,
  FiPower,
  FiRefreshCw,
} from 'react-icons/fi';
import { useVouchers } from '@/hooks/useVoucher';
import { VoucherDetailModal } from '@/components/voucher/VoucherDetailModal';
import { VoucherFormModal } from '@/components/voucher/VoucherFormModal';
import { Voucher } from '@/utils/types/voucher.types';
import { ProductPagination } from '@/components/common/paginations';

export default function VoucherPage() {
  const { 
    data: vouchers, 
    loading,
    pagination,
    fetchVouchers, 
    createVoucher,
    updateVoucher,
    inactiveVoucher,
    reactivateVoucher
  } = useVouchers();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);

  const handleStatusToggle = async (voucher: Voucher) => {
    try {
      if (voucher.status === 'Kích Hoạt') {
        await inactiveVoucher(voucher.id);
      } else {
        await reactivateVoucher(voucher.id);
      }
    } catch (error) {
      console.error('Error toggling voucher status:', error);
    }
  };
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

  const handlePageChange = (page: number) => {
    fetchVouchers(page);
  };

  const handleAddVoucher = async (data: Pick<Voucher, 'name' | 'description' | 'point' | 'discount'>) => {
    try {
      await createVoucher(data);
      onFormClose();
    } catch (error) {
      console.error('Error adding voucher:', error);
    }
  };

  const handleUpdateVoucher = async (data: Pick<Voucher, 'name' | 'description' | 'point' | 'discount'>) => {
    if (!selectedVoucher) return;
    try {
      await updateVoucher(selectedVoucher.id, data);
      onFormClose();
      setSelectedVoucher(null);
    } catch (error) {
      console.error('Error updating voucher:', error);
    }
  };

  const filteredVouchers = vouchers.filter(voucher => 
    voucher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    voucher.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    voucher.vouCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <Flex h="100%" align="center" justify="center" p={6}>
        <Spinner size="xl" color="blue.500" />
      </Flex>
    );
  }

  return (
    <Box p={{ base: 4, md: 6 }}>
      <Stack spacing={6}>
        {/* Header */}
        <Flex direction={{ base: 'column', sm: 'row' }} justify="space-between" align={{ base: 'stretch', sm: 'center' }} gap={4}>
          <Heading size={{ base: "md", md: "lg" }}>Quản lý Voucher</Heading>
          <Button
            leftIcon={<Icon as={FiPlus} />}
            colorScheme="blue"
            onClick={onFormOpen}
            w={{ base: "full", sm: "auto" }}
          >
            Thêm voucher
          </Button>
        </Flex>

        {/* Search and Refresh */}
        <HStack spacing={4}>
          <InputGroup maxW="320px">
            <InputLeftElement>
              <Icon as={FiSearch} color="gray.400" />
            </InputLeftElement>
            <Input
              placeholder="Tìm kiếm voucher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </InputGroup>

          <IconButton
            aria-label="Refresh"
            icon={<Icon as={FiRefreshCcw} />}
            onClick={() => {
              setSearchQuery('');
              fetchVouchers(1);
            }}
          />
        </HStack>

        {/* Vouchers Table */}
        <Table variant="simple" bg="white" boxShadow="sm" rounded="lg">
          <Thead bg="gray.50">
            <Tr>
              <Th>MÃ VOUCHER</Th>
              <Th>TÊN VOUCHER</Th>
              <Th isNumeric>ĐIỂM ĐỔI</Th>
              <Th isNumeric>GIẢM GIÁ</Th>
              <Th>TRẠNG THÁI</Th>
              <Th width="100px" textAlign="right">THAO TÁC</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredVouchers.map((voucher) => (
              <Tr key={voucher.id}>
                <Td>
                  <Badge colorScheme="blue">{voucher.vouCode}</Badge>
                </Td>
                <Td>
                  <Text fontWeight="medium">{voucher.name}</Text>
                  <Text fontSize="sm" color="gray.600">
                    {voucher.description}
                  </Text>
                </Td>
                <Td isNumeric>
                  <Text fontWeight="medium">
                    {voucher.point.toLocaleString()} điểm
                  </Text>
                </Td>
                <Td isNumeric>
                  <Text fontWeight="medium" color="green.500">
                    {voucher.discount}%
                  </Text>
                </Td>
                <Td>
                  <Badge 
                    colorScheme={voucher.status === 'Kích Hoạt' ? 'green' : 'red'}
                  >
                    {voucher.status}
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
                        setSelectedVoucher(voucher);
                        onDetailOpen();
                      }}
                    />
                    <IconButton
                      aria-label="Edit voucher"
                      icon={<Icon as={FiEdit2} />}
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setSelectedVoucher(voucher);
                        onFormOpen();
                      }}
                    />
                    <IconButton
                      aria-label={voucher.status === 'Kích Hoạt' ? 'Vô hiệu hóa' : 'Kích hoạt lại'}
                      icon={<Icon as={voucher.status === 'Kích Hoạt' ? FiPower : FiRefreshCw} />}
                      size="sm"
                      variant="ghost"
                      colorScheme={voucher.status === 'Kích Hoạt' ? 'red' : 'green'}
                      onClick={() => handleStatusToggle(voucher)}
                    />
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>

        {/* Pagination */}
        {!searchQuery && filteredVouchers.length > 0 && (
          <ProductPagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
            loading={loading}
          />
        )}

        {/* Empty State */}
        {filteredVouchers.length === 0 && (
          <Flex 
            direction="column" 
            align="center" 
            justify="center" 
            py={10}
            bg="gray.50"
            borderRadius="lg"
          >
            <Icon as={FiSearch} fontSize="3xl" color="gray.400" mb={2} />
            <Text color="gray.500">
              Không tìm thấy voucher nào
            </Text>
            <Button
              mt={4}
              size="sm"
              leftIcon={<Icon as={FiRefreshCcw} />}
              onClick={() => {
                setSearchQuery('');
                fetchVouchers(1);
              }}
            >
              Đặt lại bộ lọc
            </Button>
          </Flex>
        )}

        {/* Voucher Detail Modal */}
        <VoucherDetailModal
          isOpen={isDetailOpen}
          onClose={onDetailClose}
          voucher={selectedVoucher}
        />

        {/* Voucher Form Modal */}
        <VoucherFormModal
          isOpen={isFormOpen}
          onClose={() => {
            onFormClose();
            setSelectedVoucher(null);
          }}
          onSubmit={selectedVoucher ? handleUpdateVoucher : handleAddVoucher}
          initialData={selectedVoucher}
          title={selectedVoucher ? 'Chỉnh sửa voucher' : 'Thêm voucher mới'}
        />
      </Stack>
    </Box>
  );
}