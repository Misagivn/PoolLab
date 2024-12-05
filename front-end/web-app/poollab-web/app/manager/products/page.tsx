'use client';

import { useEffect, useState, useRef } from 'react';
import {
  Box,
  Button,
  useDisclosure,
  VStack,
  Spinner,
  Center,
  Flex,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  HStack,
  Icon,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useToast,
} from '@chakra-ui/react';
import { FiPlus, FiSearch, FiRefreshCcw } from 'react-icons/fi';
import { ProductTable } from '@/components/product/ProductTable';
import { ProductForm } from '@/components/product/ProductForm';
import { ProductDetail } from '@/components/product/ProductDetail';
import { useProduct } from '@/hooks/useProduct';
import { useGroup } from '@/hooks/useGroup';
import { useType } from '@/hooks/useType';
import { useUnit } from '@/hooks/useUnit';
import { Product } from '@/utils/types/product';

export default function ProductsClient() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
  
  const cancelRef = useRef(null);
  const toast = useToast();

  const {
    isOpen: isFormOpen,
    onOpen: onFormOpen,
    onClose: onFormClose
  } = useDisclosure();

  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose
  } = useDisclosure();

  const {
    isOpen: isDetailOpen,
    onOpen: onDetailOpen,
    onClose: onDetailClose
  } = useDisclosure();

  const {
    products,
    loading: productsLoading,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductById
  } = useProduct();

  const { groups, loading: groupsLoading, fetchGroups } = useGroup();
  const { types, loading: typesLoading, fetchTypes } = useType();
  const { units, loading: unitsLoading, fetchUnits } = useUnit();

  useEffect(() => {
    fetchProducts();
    fetchGroups();
    fetchTypes();
    fetchUnits();
  }, [fetchProducts, fetchGroups, fetchTypes, fetchUnits]);

  const handleCreateProduct = () => {
    setSelectedProduct(null);
    onFormOpen();
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    onFormOpen();
  };

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    onDeleteOpen();
  };

  const handleViewDetail = async (id: string) => {
    try {
      const product = await getProductById(id);
      if (product) {
        setDetailProduct(product);
        onDetailOpen();
      }
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Không thể tải thông tin sản phẩm',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;
    
    try {
      await deleteProduct(productToDelete.id);
      toast({
        title: 'Thành công',
        description: 'Xóa sản phẩm thành công',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onDeleteClose();
      setProductToDelete(null);
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể xóa sản phẩm',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.descript.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isLoading = productsLoading || groupsLoading || typesLoading || unitsLoading;

  if (isLoading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <Box p={6}>
      <VStack spacing={6}>
        <Flex justify="space-between" align="center" w="full">
          <Heading size="lg">Quản lý sản phẩm</Heading>
          <Button
            leftIcon={<Icon as={FiPlus} />}
            colorScheme="blue"
            onClick={handleCreateProduct}
          >
            Thêm sản phẩm
          </Button>
        </Flex>

        <HStack spacing={4} w="full">
          <InputGroup maxW="320px">
            <InputLeftElement>
              <Icon as={FiSearch} color="gray.400" />
            </InputLeftElement>
            <Input
              placeholder="Tìm kiếm sản phẩm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </InputGroup>

          <Button
            leftIcon={<Icon as={FiRefreshCcw} />}
            onClick={() => {
              setSearchQuery('');
              fetchProducts();
            }}
          >
            Làm mới
          </Button>
        </HStack>

        <ProductTable
          products={filteredProducts}
          onEdit={handleEditProduct}
          onDelete={handleDeleteClick}
          onViewDetail={handleViewDetail}
        />

        {isFormOpen && (
          <ProductForm
            isOpen={isFormOpen}
            onClose={onFormClose}
            product={selectedProduct}
            groups={groups}
            types={types}
            units={units}
            onSubmit={async (data) => {
              try {
                if (selectedProduct) {
                  await updateProduct(selectedProduct.id, data);
                  toast({
                    title: 'Thành công',
                    description: 'Cập nhật sản phẩm thành công',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                  });
                } else {
                  await createProduct(data);
                  toast({
                    title: 'Thành công',
                    description: 'Thêm sản phẩm mới thành công',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                  });
                }
                onFormClose();
                fetchProducts();
              } catch (error) {
                toast({
                  title: 'Lỗi',
                  description: 'Không thể lưu sản phẩm',
                  status: 'error',
                  duration: 3000,
                  isClosable: true,
                });
              }
            }}
          />
        )}

        <ProductDetail
          isOpen={isDetailOpen}
          onClose={onDetailClose}
          product={detailProduct}
          types={types}     
          groups={groups}    
          units={units}      
          onEdit={(product) => {
            onDetailClose();
            handleEditProduct(product);
          }}
        />

        <AlertDialog
          isOpen={isDeleteOpen}
          leastDestructiveRef={cancelRef}
          onClose={onDeleteClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader>
                Xóa sản phẩm
              </AlertDialogHeader>

              <AlertDialogBody>
                Bạn có chắc chắn muốn xóa sản phẩm này?
                Hành động này không thể hoàn tác.
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onDeleteClose}>
                  Hủy
                </Button>
                <Button 
                  colorScheme="red" 
                  onClick={handleDeleteConfirm} 
                  ml={3}
                  isLoading={productsLoading}
                >
                  Xóa
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </VStack>
    </Box>
  );
}