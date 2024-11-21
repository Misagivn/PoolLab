import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Grid,
  Box,
  Image,
  VStack,
  Text,
  Badge,
  HStack,
  Icon,
  IconButton,
} from '@chakra-ui/react';
import { FiPackage, FiDollarSign, FiTag, FiCamera } from 'react-icons/fi';
import { Product } from '@/utils/types/product.types';
import { useRef } from 'react';
import { formatCurrency } from '@/utils/format';

interface ProductDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onUpdateImage?: (file: File) => Promise<void>;
}

export const ProductDetailModal = ({
  isOpen,
  onClose,
  product,
  onUpdateImage
}: ProductDetailModalProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!product) return null;

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onUpdateImage) {
      await onUpdateImage(file);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Chi tiết sản phẩm {product.name}</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Grid templateColumns="1fr 1.5fr" gap={6}>
            <Box>
              <Box position="relative">
                <input
                  type="file"
                  ref={fileInputRef}
                  hidden
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                <Image
                  src={product.productImg || 'https://via.placeholder.com/200x200'}
                  alt={product.name}
                  borderRadius="md"
                  objectFit="cover"
                  w="100%"
                  h="200px"
                />
                {onUpdateImage && (
                  <IconButton
                    aria-label="Upload image"
                    icon={<Icon as={FiCamera} />}
                    position="absolute"
                    bottom={2}
                    right={2}
                    onClick={() => fileInputRef.current?.click()}
                    size="sm"
                  />
                )}
              </Box>
            </Box>
            
            <VStack align="stretch" spacing={4}>
              <Box>
                <Text color="gray.500" fontSize="sm">Tên sản phẩm</Text>
                <Text fontSize="lg" fontWeight="bold">{product.name}</Text>
              </Box>

              <Box>
                <Text color="gray.500" fontSize="sm">Loại sản phẩm</Text>
                <HStack>
                  <Icon as={FiTag} color="blue.500" />
                  <Text>{product.productTypeName}</Text>
                </HStack>
              </Box>

              <Box>
                <Text color="gray.500" fontSize="sm">Nhóm sản phẩm</Text>
                <Text>{product.productGroupName}</Text>
              </Box>

              <Box>
                <Text color="gray.500" fontSize="sm">Số lượng</Text>
                <Badge 
                  colorScheme={product.quantity <= product.minQuantity ? 'red' : 'green'}
                >
                  {product.quantity} {product.unitName}
                </Badge>
              </Box>

              <Box>
                <Text color="gray.500" fontSize="sm">Giá</Text>
                <HStack>
                  <Icon as={FiDollarSign} color="green.500" />
                  <Text fontWeight="bold">{formatCurrency(product.price)}</Text>
                </HStack>
              </Box>

              {product.descript && (
                <Box>
                  <Text color="gray.500" fontSize="sm">Mô tả</Text>
                  <Text>{product.descript}</Text>
                </Box>
              )}
            </VStack>
          </Grid>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};