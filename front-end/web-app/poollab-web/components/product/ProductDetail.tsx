import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Box,
  Image,
  Text,
  VStack,
  Badge,
  Button,
  Grid,
  GridItem,
  Divider,
} from '@chakra-ui/react';
import { EditIcon } from '@chakra-ui/icons';
import { Product } from '@/utils/types/product';

interface ProductDetailProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onEdit: (product: Product) => void;
  types: any[];
  groups: any[];
  units: any[];
}

export const ProductDetail = ({ 
  isOpen, 
  onClose, 
  product, 
  onEdit,
  types,
  groups,
  units 
}: ProductDetailProps) => {
  if (!product) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Còn Hàng':
        return 'green';
      case 'Hết Hàng':
        return 'red';
      case 'Ngừng Kinh Doanh':
        return 'gray';
      default:
        return 'blue';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const typeName = types.find(t => t.id === product.productTypeId)?.name || 'Chưa có';
  const groupName = groups.find(g => g.id === product.productGroupId)?.name || 'Chưa có';
  const unitName = units.find(u => u.id === product.unitId)?.name || 'Chưa có';

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Chi tiết sản phẩm</ModalHeader>
        <ModalCloseButton />
        
        <ModalBody pb={6}>
          <VStack spacing={6} align="stretch">
            <Box display="flex" justifyContent="center">
              <Image
                src={product.productImg}
                alt={product.name}
                maxH="200px"
                objectFit="contain"
                fallbackSrc="https://via.placeholder.com/200"
              />
            </Box>

            <Grid templateColumns="repeat(2, 1fr)" gap={4}>
              <GridItem>
                <Text fontWeight="bold">Tên sản phẩm</Text>
                <Text>{product.name}</Text>
              </GridItem>

              <GridItem>
                <Text fontWeight="bold">Trạng thái</Text>
                <Badge colorScheme={getStatusColor(product.status)}>
                  {product.status}
                </Badge>
              </GridItem>

              <GridItem>
                <Text fontWeight="bold">Giá</Text>
                <Text>{product.price.toLocaleString()}đ</Text>
              </GridItem>

              <GridItem>
                <Text fontWeight="bold">Số lượng</Text>
                <Text>{product.quantity}</Text>
              </GridItem>

              <GridItem>
                <Text fontWeight="bold">Số lượng tối thiểu</Text>
                <Text>{product.minQuantity}</Text>
              </GridItem>

              <GridItem>
                <Text fontWeight="bold">Đơn vị</Text>
                <Text>{unitName}</Text>
              </GridItem>

              <GridItem>
                <Text fontWeight="bold">Loại sản phẩm</Text>
                <Text>{typeName}</Text>
              </GridItem>

              <GridItem>
                <Text fontWeight="bold">Nhóm sản phẩm</Text>
                <Text>{groupName}</Text>
              </GridItem>
            </Grid>

            <Divider />

            <Box>
              <Text fontWeight="bold" mb={2}>Mô tả</Text>
              <Text whiteSpace="pre-wrap">{product.descript || 'Chưa có mô tả'}</Text>
            </Box>

            <Divider />

            <Grid templateColumns="repeat(2, 1fr)" gap={4}>
              <GridItem>
                <Text fontWeight="bold">Ngày tạo</Text>
                <Text>{formatDate(product.createdDate)}</Text>
              </GridItem>

              <GridItem>
                <Text fontWeight="bold">Lần cập nhật cuối</Text>
                <Text>{product.updatedDate ? formatDate(product.updatedDate) : 'Chưa cập nhật'}</Text>
              </GridItem>
            </Grid>

            <Box>
              <Button
                leftIcon={<EditIcon />}
                colorScheme="blue"
                onClick={() => onEdit(product)}
                width="full"
              >
                Chỉnh sửa sản phẩm
              </Button>
            </Box>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};