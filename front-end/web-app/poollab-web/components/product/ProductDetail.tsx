import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  VStack,
  Text,
  Image,
  Skeleton,
  Badge,
  Divider,
  Box,
  Grid,
  GridItem,
} from '@chakra-ui/react';
import { useProduct } from '@/hooks/useProduct';
import { useGroup } from '@/hooks/useGroup';
import { useType } from '@/hooks/useType';
import { useUnit } from '@/hooks/useUnit';

interface ProductDetailProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
}

const DetailItem = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <Box>
    <Text fontSize="sm" color="gray.500" mb={1}>
      {label}
    </Text>
    <Text fontSize="md" fontWeight="medium">
      {value || 'Không có thông tin'}
    </Text>
  </Box>
);

export const ProductDetail: React.FC<ProductDetailProps> = ({
  isOpen,
  onClose,
  productId
}) => {
  const { 
    fetchProductDetail, 
    selectedProduct, 
    detailLoading,
    formatPrice, 
    formatDate 
  } = useProduct();

  const { groups, fetchGroups } = useGroup();
  const { types, fetchTypes } = useType();
  const { units, fetchUnits } = useUnit();

  React.useEffect(() => {
    if (isOpen && productId) {
      fetchProductDetail(productId);
      fetchGroups();
      fetchTypes();
      fetchUnits();
    }
  }, [isOpen, productId, fetchProductDetail, fetchGroups, fetchTypes, fetchUnits]);

  const getGroupName = (groupId: string) => {
    return groups.find(group => group.id === groupId)?.name || 'Không xác định';
  };

  const getTypeName = (typeId: string) => {
    return types.find(type => type.id === typeId)?.name || 'Không xác định';
  };

  const getUnitName = (unitId: string) => {
    return units.find(unit => unit.id === unitId)?.name || 'Không xác định';
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      size="xl"
      scrollBehavior="inside"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Chi tiết sản phẩm</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          {detailLoading ? (
            <VStack spacing={4}>
              <Skeleton height="200px" width="100%" />
              <Skeleton height="20px" width="100%" />
              <Skeleton height="20px" width="100%" />
            </VStack>
          ) : selectedProduct ? (
            <VStack spacing={6} align="stretch">
              {/* Product Image */}
              <Box position="relative">
                <Image
                  src={selectedProduct.productImg || '/placeholder-image.jpg'}
                  alt={selectedProduct.name}
                  fallbackSrc="/placeholder-image.jpg"
                  objectFit="cover"
                  width="100%"
                  height="300px"
                  borderRadius="md"
                />
                <Badge
                  position="absolute"
                  top={4}
                  right={4}
                  colorScheme={
                    selectedProduct.status === 'Còn Hàng' ? 'green'
                    : selectedProduct.status === 'Hết Hàng' ? 'red'
                    : 'yellow'
                  }
                  fontSize="md"
                  px={3}
                  py={1}
                >
                  {selectedProduct.status}
                </Badge>
              </Box>

              {/* Product Basic Info */}
              <VStack align="stretch" spacing={4}>
                <Text fontSize="2xl" fontWeight="bold">
                  {selectedProduct.name}
                </Text>
                <Text color="gray.600">
                  {selectedProduct.descript || 'Không có mô tả'}
                </Text>
              </VStack>

              <Divider />

              {/* Product Details Grid */}
              <Grid templateColumns="repeat(2, 1fr)" gap={6}>
                <GridItem>
                  <DetailItem
                    label="Giá"
                    value={formatPrice(selectedProduct.price)}
                  />
                </GridItem>
                <GridItem>
                  <DetailItem
                    label="Số lượng hiện tại"
                    value={`${selectedProduct.quantity} ${getUnitName(selectedProduct.unitId)}`}
                  />
                </GridItem>
                <GridItem>
                  <DetailItem
                    label="Số lượng tối thiểu"
                    value={`${selectedProduct.minQuantity} ${getUnitName(selectedProduct.unitId)}`}
                  />
                </GridItem>
                <GridItem>
                  <DetailItem
                    label="Nhóm sản phẩm"
                    value={getGroupName(selectedProduct.productGroupId)}
                  />
                </GridItem>
                <GridItem>
                  <DetailItem
                    label="Loại sản phẩm"
                    value={getTypeName(selectedProduct.productTypeId)}
                  />
                </GridItem>
                <GridItem>
                  <DetailItem
                    label="Đơn vị tính"
                    value={getUnitName(selectedProduct.unitId)}
                  />
                </GridItem>
                <GridItem>
                  <DetailItem
                    label="Ngày tạo"
                    value={formatDate(selectedProduct.createdDate)}
                  />
                </GridItem>
                {selectedProduct.updatedDate && (
                  <GridItem>
                    <DetailItem
                      label="Ngày cập nhật"
                      value={formatDate(selectedProduct.updatedDate)}
                    />
                  </GridItem>
                )}
              </Grid>
            </VStack>
          ) : (
            <Text>Không tìm thấy thông tin sản phẩm</Text>
          )}
        </ModalBody>

        <ModalFooter>
          <Button onClick={onClose}>Đóng</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};