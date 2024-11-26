import React from 'react';
import {
  Card,
  CardBody,
  Image,
  VStack,
  Flex,
  Heading,
  Text,
  Badge,
  HStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Icon,
} from '@chakra-ui/react';
import { FiMoreVertical, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { Product } from '@/utils/types/product.types';

interface ProductCardProps {
  product: Product;
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onEdit, onDelete }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  return (
    <Card overflow="hidden">
      <CardBody p={4}>
        <Image
          src={product.productImg || '/placeholder-product.png'}
          alt={product.name}
          borderRadius="lg"
          objectFit="cover"
          height="200px"
          width="100%"
          fallbackSrc="https://via.placeholder.com/200"
        />
        <VStack align="stretch" mt={4} spacing={2}>
          <Flex justify="space-between" align="center">
            <Heading size="sm" noOfLines={1}>{product.name}</Heading>
            <Menu>
              <MenuButton
                as={IconButton}
                icon={<FiMoreVertical />}
                variant="ghost"
                size="sm"
              />
              <MenuList>
                <MenuItem 
                  icon={<Icon as={FiEdit2} />}
                  onClick={() => onEdit?.(product)}
                >
                  Chỉnh sửa
                </MenuItem>
                <MenuItem 
                  icon={<Icon as={FiTrash2} />} 
                  color="red.500"
                  onClick={() => onDelete?.(product)}
                >
                  Xóa
                </MenuItem>
              </MenuList>
            </Menu>
          </Flex>
          
          <Text color="blue.500" fontWeight="bold">
            {formatPrice(product.price)}
          </Text>
          
          <HStack justify="space-between">
            <Badge colorScheme={product.status === 'Còn Hàng' ? 'green' : 'red'}>
              {product.status}
            </Badge>
            <Text fontSize="sm" color="gray.500">
              SL: {product.quantity}
            </Text>
          </HStack>

          <Text fontSize="sm" color="gray.500">
            {product.groupName} - {product.productTypeName}
          </Text>
        </VStack>
      </CardBody>
    </Card>
  );
};