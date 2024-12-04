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
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from '@chakra-ui/react';
import { FiPlus } from 'react-icons/fi';
import { ProductList } from '@/components/product/ProductList';
import { ProductFiltersProps } from '@/components/product/ProductFilters';
import { ProductPagination } from '@/components/common/paginations';
import { ProductCreate } from '@/components/product/ProductCreate';
import { ProductDetail } from '@/components/product/ProductDetail';
import { ProductUpdate } from '@/components/product/ProductUpdate';
import { useProduct } from '@/hooks/useProduct';
import { Product } from '@/utils/types/product';

export default function ProductsPage() {
  const toast = useToast();
  
  // Modal states
  const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure();
  const { isOpen: isDetailOpen, onOpen: onDetailOpen, onClose: onDetailClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const { isOpen: isUpdateOpen, onOpen: onUpdateOpen, onClose: onUpdateClose } = useDisclosure();
  
  // Refs
  const cancelRef = React.useRef<HTMLButtonElement>(null);
  
  // Local state
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);
  
  // Hooks
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
    deleteProduct,
    formatPrice,
    formatDate,
    clearSelectedProduct
  } = useProduct();

  // Get unique values for filters
  const uniqueGroups = [...new Set(products.map(p => p.groupName))];
  const uniqueStatuses = [...new Set(products.map(p => p.status))];

  // Handlers
  const handleViewDetail = (product: Product) => {
    console.log('Opening detail for product:', product);
    setSelectedProduct(product);
    onDetailOpen();
  };

  const handleEdit = (product: Product) => {
    console.log('Opening edit for product:', product);
    setSelectedProduct(product);
    onUpdateOpen();
  };

  const handleDeleteClick = (product: Product) => {
    setSelectedProduct(product);
    onDeleteOpen();
  };

  const handleDeleteConfirm = async () => {
    if (selectedProduct) {
      try {
        await deleteProduct(selectedProduct.id);
        toast({
          title: 'Thành công',
          description: 'Xóa sản phẩm thành công',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        onDeleteClose();
        setSelectedProduct(null);
        handleRefresh();
      } catch (error) {
        // Error is handled in the hook
      }
    }
  };

  const handleDetailClose = () => {
    clearSelectedProduct();
    setSelectedProduct(null);
    onDetailClose();
  };

  const handleUpdateClose = () => {
    setSelectedProduct(null);
    onUpdateClose();
  };

  const handleCreateSuccess = () => {
    handleRefresh();
    onCreateClose();
    toast({
      title: 'Thành công',
      description: 'Thêm sản phẩm mới thành công',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleUpdateSuccess = () => {
    handleRefresh();
    handleUpdateClose();
    toast({
      title: 'Thành công',
      description: 'Cập nhật sản phẩm thành công',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

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
            onClick={onCreateOpen}
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
          loading={loading}
        />

        {/* Product List */}
        <ProductList
          products={products}
          loading={loading}
          onRefresh={handleRefresh}
          onInfo={handleViewDetail}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
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
          isOpen={isCreateOpen} 
          onClose={onCreateClose}
          onSuccess={handleCreateSuccess}
        />

        {/* Product Detail Modal */}
        {selectedProduct && (
          <ProductDetail
            isOpen={isDetailOpen}
            onClose={handleDetailClose}
            productId={selectedProduct.id}
          />
        )}

        {/* Product Update Modal */}
        {selectedProduct && (
          <ProductUpdate
            isOpen={isUpdateOpen}
            onClose={handleUpdateClose}
            product={selectedProduct}
            onSuccess={handleUpdateSuccess}
          />
        )}

        {/* Delete Confirmation Dialog */}
        <AlertDialog
          isOpen={isDeleteOpen}
          leastDestructiveRef={cancelRef}
          onClose={onDeleteClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Xác nhận xóa sản phẩm
              </AlertDialogHeader>

              <AlertDialogBody>
                Bạn có chắc chắn muốn xóa sản phẩm "{selectedProduct?.name}"? 
                Hành động này không thể hoàn tác.
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onDeleteClose}>
                  Hủy
                </Button>
                <Button colorScheme="red" onClick={handleDeleteConfirm} ml={3}>
                  Xóa
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </Stack>
    </Box>
  );
}