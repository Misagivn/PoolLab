import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  HStack,
  IconButton,
  Icon,
  Badge,
  Image,
  Box,
} from '@chakra-ui/react';
import { FiInfo, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { Product } from '@/utils/types/product.types';
import { formatCurrency } from '@/utils/format';

interface ProductListProps {
  products: Product[];
  onView: (product: Product) => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

const getStatusColor = (quantity: number, minQuantity: number) => {
  if (quantity <= 0) return 'red';
  if (quantity <= minQuantity) return 'yellow';
  return 'green';
};

export const ProductList = ({
  products,
  onView,
  onEdit,
  onDelete
}: ProductListProps) => {
  return (
    <Table variant="simple">
      <Thead bg="gray.50">
        <Tr>
          <Th>STT</Th>
          <Th>HÌNH ẢNH</Th>
          <Th>TÊN SẢN PHẨM</Th>
          <Th>LOẠI</Th>
          <Th>NHÓM</Th>
          <Th>ĐƠN VỊ</Th>
          <Th>SỐ LƯỢNG</Th>
          <Th>GIÁ</Th>
          <Th width="100px" textAlign="right">THAO TÁC</Th>
        </Tr>
      </Thead>
      <Tbody>
        {products.map((product, index) => (
          <Tr key={product.id}>
            <Td>{index + 1}</Td>
            <Td>
              <Box w="50px" h="50px" overflow="hidden" borderRadius="md">
                <Image
                  src={product.productImg || 'https://via.placeholder.com/200x200'}
                  alt={product.name}
                  objectFit="cover"
                  w="100%"
                  h="100%"
                />
              </Box>
            </Td>
            <Td>{product.name}</Td>
            <Td>{product.productTypeName}</Td>
            <Td>{product.productGroupName}</Td>
            <Td>{product.unitName}</Td>
            <Td>
              <Badge colorScheme={getStatusColor(product.quantity, product.minQuantity)}>
                {product.quantity}
              </Badge>
            </Td>
            <Td>{formatCurrency(product.price)}</Td>
            <Td>
              <HStack spacing={2} justify="flex-end">
                <IconButton
                  aria-label="View product"
                  icon={<Icon as={FiInfo} />}
                  size="sm"
                  variant="ghost"
                  onClick={() => onView(product)}
                />
                <IconButton
                  aria-label="Edit product"
                  icon={<Icon as={FiEdit2} />}
                  size="sm"
                  variant="ghost"
                  onClick={() => onEdit(product)}
                />
                <IconButton
                  aria-label="Delete product"
                  icon={<Icon as={FiTrash2} />}
                  size="sm"
                  variant="ghost"
                  colorScheme="red"
                  onClick={() => onDelete(product)}
                />
              </HStack>
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};