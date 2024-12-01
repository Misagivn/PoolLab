import React from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Icon,
  IconButton,
  HStack,
  Flex,
  Button,
  Text,
  Skeleton
} from '@chakra-ui/react';
import { FiInfo, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { Product } from '@/utils/types/product.types';

interface ProductListProps {
  products: Product[];
  loading: boolean;
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
  onRefresh: () => void;
}

export const ProductList: React.FC<ProductListProps> = ({
  products,
  loading,
  onEdit,
  onDelete,
  onRefresh
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  if (loading) {
    return (
      <Box>
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} height="40px" my={2} />
        ))}
      </Box>
    );
  }

  if (products.length === 0) {
    return (
      <Flex direction="column" align="center" justify="center" py={10}>
        <Text color="gray.500">Không tìm thấy sản phẩm nào</Text>
        <Button mt={4} size="sm" onClick={onRefresh}>
          Làm mới
        </Button>
      </Flex>
    );
  }

  return (
    <Box>
      {/* Status Legend */}
      <HStack spacing={4} mb={4}>
        <Badge colorScheme="green" px={3} py={1}>CÒN HÀNG</Badge>
        <Badge colorScheme="red" px={3} py={1}>HẾT HÀNG</Badge>
        <Badge colorScheme="yellow" px={3} py={1}>SẮP HẾT</Badge>
      </HStack>

      {/* Products Table */}
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>STT</Th>
            <Th>TÊN SẢN PHẨM</Th>
            <Th>LOẠI</Th>
            <Th>KHU VỰC</Th>
            <Th>GIÁ</Th>
            <Th>SỐ LƯỢNG</Th>
            <Th>TRẠNG THÁI</Th>
            <Th>THAO TÁC</Th>
          </Tr>
        </Thead>
        <Tbody>
          {products.map((product, index) => (
            <Tr key={product.id}>
              <Td>{index + 1}</Td>
              <Td>{product.name}</Td>
              <Td>{product.productTypeName}</Td>
              <Td>{product.groupName}</Td>
              <Td>{formatPrice(product.price)}</Td>
              <Td>{product.quantity}</Td>
              <Td>
                <Badge 
                  colorScheme={
                    product.status === 'Còn Hàng' ? 'green' 
                    : product.status === 'Hết Hàng' ? 'red' 
                    : 'yellow'
                  }
                >
                  {product.status}
                </Badge>
              </Td>
              <Td>
                <HStack spacing={2}>
                  <IconButton
                    aria-label="Information"
                    icon={<Icon as={FiInfo} />}
                    size="sm"
                    variant="ghost"
                  />
                  <IconButton
                    aria-label="Edit"
                    icon={<Icon as={FiEdit2} />}
                    size="sm"
                    variant="ghost"
                    onClick={() => onEdit?.(product)}
                  />
                  <IconButton
                    aria-label="Delete"
                    icon={<Icon as={FiTrash2} />}
                    size="sm"
                    variant="ghost"
                    onClick={() => onDelete?.(product)}
                  />
                </HStack>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default ProductList;