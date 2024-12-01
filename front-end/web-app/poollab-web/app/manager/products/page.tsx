'use client';

import React from 'react';
import {
  Box,
  Flex,
  Stack,
  Heading,
  Button,
  Icon,
  useToast,
  useDisclosure,
} from '@chakra-ui/react';
import { FiPlus } from 'react-icons/fi';
import { ProductList } from '@/components/product/ProductList';
import { ProductFiltersProps } from '@/components/product/ProductFilters';
import { ProductPagination } from '@/components/common/paginations';
import { ProductCreate } from '@/components/product/ProductCreate';
import { useProduct } from '@/hooks/useProduct';

export default function ProductsPage() {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const {
    products,
    loading,
    totalPages,
    currentPage,
    pageSize,
    filters,
    handleFiltersChange,
    handleRefresh,
    handlePageChange,
    formatPrice,
    formatDate,
  } = useProduct();

  // Get unique values for filters
  const uniqueGroups = [...new Set(products.map(p => p.groupName))];
  const uniqueStatuses = [...new Set(products.map(p => p.status))];

  return (
    <Box p={{ base: 4, md: 6 }}>
      <Stack spacing={6}>
        {/* Header */}
        <Flex 
          direction={{ base: 'column', md: 'row' }}
          justify="space-between"
          align={{ base: 'stretch', md: 'center' }}
          gap={4}
        >
          <Heading size="lg">Quản lý sản phẩm</Heading>
          <Button
            leftIcon={<Icon as={FiPlus} />}
            colorScheme="blue"
            w={{ base: 'full', md: 'auto' }}
            onClick={onOpen}
          >
            Thêm sản phẩm
          </Button>
        </Flex>

        {/* Filters */}
        <ProductFiltersProps
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onRefresh={handleRefresh}
          groups={uniqueGroups}
          statuses={uniqueStatuses}
        />

        {/* Product List View */}
        <ProductList
          products={products}
          loading={loading}
          onRefresh={handleRefresh}
          onEdit={(product) => {
            toast({
              title: 'Thông báo',
              description: 'Tính năng đang được phát triển',
              status: 'info',
              duration: 3000,
              isClosable: true,
            });
          }}
          onDelete={(product) => {
            toast({
              title: 'Thông báo',
              description: 'Tính năng đang được phát triển',
              status: 'info',
              duration: 3000,
              isClosable: true,
            });
          }}
          formatPrice={formatPrice}
          formatDate={formatDate}
        />

        {/* Pagination */}
        {!loading && products.length > 0 && (
          <ProductPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            isDisabled={loading}
          />
        )}

        {/* Create Product Modal */}
        <ProductCreate 
          isOpen={isOpen} 
          onClose={onClose}
          onSuccess={handleRefresh}
        />
      </Stack>
    </Box>
  );
}