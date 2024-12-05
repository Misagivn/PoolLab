'use client';

import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Image,
  IconButton,
  HStack,
  Badge,
  Tooltip,
  Box,
  CardBody,
  Card
} from '@chakra-ui/react';
import { FiInfo, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { Product } from '@/utils/types/product';

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  onViewDetail: (id: string) => void;
}

export const ProductTable = ({ products, onEdit, onDelete, onViewDetail }: ProductTableProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Còn Hàng':
        return 'green';
      case 'Hết Hàng':
        return 'red';
      case 'Ngừng Kinh Doanh':
        return 'gray';
      case 'string':
        return 'blue';
      default:
        return 'blue';
    }
  };

  return (
    <Box>
        <Card variant={'outline'} mb={6}>
          <CardBody>
          <Table variant="simple">
      <Thead>
        <Tr>
          <Th>HÌNH ẢNH</Th>
          <Th>TÊN SẢN PHẨM</Th>
          <Th>LOẠI</Th>
          <Th>NHÓM</Th>
          <Th>ĐƠN VỊ</Th>
          <Th>SỐ LƯỢNG</Th>
          <Th>GIÁ</Th>
          <Th>TRẠNG THÁI</Th>
          <Th>THAO TÁC</Th>
        </Tr>
      </Thead>
      <Tbody>
        {products.map((product) => (
          <Tr key={product.id}>
            <Td>
              <Image
                src={product.productImg}
                alt={product.name}
                boxSize="50px"
                objectFit="cover"
                borderRadius="md"
                fallbackSrc="https://via.placeholder.com/50"
              />
            </Td>
            <Td>{product.name}</Td>
            <Td>{product.productTypeName}</Td>
            <Td>{product.groupName}</Td>
            <Td>{product.unitName}</Td>
            <Td isNumeric>{product.quantity}</Td>
            <Td isNumeric>{product.price.toLocaleString()}đ</Td>
            <Td>
              <Badge colorScheme={getStatusColor(product.status)}>
                {product.status}
              </Badge>
            </Td>
            <Td>
              <HStack spacing={2}>
                {/* <Tooltip label="Xem chi tiết"> */}
                  <IconButton
                    aria-label="View detail"
                    icon={<FiInfo />}
                    onClick={() => onViewDetail(product.id)}
                    size="sm"
                    variant="ghost"
                    colorScheme="blue"
                  />
                {/* </Tooltip> */}
                {/* <Tooltip label="Chỉnh sửa"> */}
                  <IconButton
                    aria-label="Edit"
                    icon={<FiEdit2 />}
                    onClick={() => onEdit(product)}
                    size="sm"
                    variant="ghost"
                  />
                {/* </Tooltip> */}
                {/* <Tooltip label="Xóa"> */}
                  <IconButton
                    aria-label="Delete"
                    icon={<FiTrash2 />}
                    onClick={() => onDelete(product.id)}
                    size="sm"
                    variant="ghost"
                    colorScheme="red"
                  />
                {/* </Tooltip> */}
              </HStack>
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
          </CardBody>

        </Card>
    </Box>
  );
};