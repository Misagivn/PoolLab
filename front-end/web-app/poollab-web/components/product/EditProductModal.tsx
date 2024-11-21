import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
  Textarea,
  FormErrorMessage,
  Box,
  Image,
  IconButton,
  Icon,
  NumberInput,
  NumberInputField,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';
import { useState, useRef, useEffect } from 'react';
import { FiCamera, FiDollarSign } from 'react-icons/fi';
import { Product, UpdateProductRequest } from '@/utils/types/product.types';

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (productId: string, data: UpdateProductRequest) => Promise<void>;
  product: Product | null;
  productTypes: Array<{ id: string; name: string }>;
  productGroups: Array<{ id: string; name: string }>;
  units: Array<{ id: string; name: string }>;
}

export const EditProductModal = ({
  isOpen,
  onClose,
  onSubmit,
  product,
  productTypes,
  productGroups,
  units
}: EditProductModalProps) => {
  const [formData, setFormData] = useState<UpdateProductRequest>({
    name: '',
    descript: '',
    quantity: 0,
    minQuantity: 0,
    price: 0,
    productImg: '',
    productTypeId: '',
    productGroupId: '',
    unitId: '',
    status: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        descript: product.descript,
        quantity: product.quantity,
        minQuantity: product.minQuantity,
        price: product.price,
        productImg: product.productImg,
        productTypeId: product.productTypeId,
        productGroupId: product.productGroupId,
        unitId: product.unitId,
        status: product.status
      });
    }
  }, [product]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name) {
      newErrors.name = 'Tên sản phẩm là bắt buộc';
    }
    if (!formData.productTypeId) {
      newErrors.productTypeId = 'Vui lòng chọn loại sản phẩm';
    }
    if (!formData.productGroupId) {
      newErrors.productGroupId = 'Vui lòng chọn nhóm sản phẩm';
    }
    if (!formData.unitId) {
      newErrors.unitId = 'Vui lòng chọn đơn vị tính';
    }
    if (formData.price <= 0) {
      newErrors.price = 'Giá phải lớn hơn 0';
    }
    if (formData.minQuantity < 0) {
      newErrors.minQuantity = 'Số lượng tối thiểu không được âm';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!product || !validateForm()) return;

    try {
      setLoading(true);
      await onSubmit(product.id, formData);
      onClose();
    } catch (error) {
      console.error('Error updating product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch(
        'https://poollabwebapi20241008201316.azurewebsites.net/api/Product/UploadFileProductImg',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: formData
        }
      );
      
      const result = await response.json();
      if (result.status === 200) {
        setFormData(prev => ({ ...prev, productImg: result.data }));
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  if (!product) return null;

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      size="xl"
      closeOnOverlayClick={false}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Chỉnh sửa sản phẩm {product.name}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <Box position="relative" width="100%" height="200px">
              <input
                type="file"
                ref={fileInputRef}
                hidden
                accept="image/*"
                onChange={handleImageUpload}
              />
              <Box
                width="100%"
                height="100%"
                borderWidth={2}
                borderStyle="dashed"
                borderRadius="md"
                display="flex"
                alignItems="center"
                justifyContent="center"
                position="relative"
                overflow="hidden"
              >
                {formData.productImg ? (
                  <Image
                    src={formData.productImg}
                    alt="Product preview"
                    objectFit="cover"
                    width="100%"
                    height="100%"
                  />
                ) : (
                  <IconButton
                    aria-label="Upload image"
                    icon={<Icon as={FiCamera} />}
                    onClick={() => fileInputRef.current?.click()}
                    size="lg"
                    variant="ghost"
                  />
                )}
              </Box>
            </Box>

            <FormControl isRequired isInvalid={!!errors.name}>
              <FormLabel>Tên sản phẩm</FormLabel>
              <Input
                value={formData.name}
                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Nhập tên sản phẩm"
              />
              <FormErrorMessage>{errors.name}</FormErrorMessage>
            </FormControl>

            <FormControl isRequired isInvalid={!!errors.productTypeId}>
              <FormLabel>Loại sản phẩm</FormLabel>
              <Select
                value={formData.productTypeId}
                onChange={e => setFormData(prev => ({ ...prev, productTypeId: e.target.value }))}
              >
                {productTypes.map(type => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </Select>
              <FormErrorMessage>{errors.productTypeId}</FormErrorMessage>
            </FormControl>

            <FormControl isRequired isInvalid={!!errors.productGroupId}>
              <FormLabel>Nhóm sản phẩm</FormLabel>
              <Select
                value={formData.productGroupId}
                onChange={e => setFormData(prev => ({ ...prev, productGroupId: e.target.value }))}
              >
                {productGroups.map(group => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))}
              </Select>
              <FormErrorMessage>{errors.productGroupId}</FormErrorMessage>
            </FormControl>

            <FormControl isRequired isInvalid={!!errors.unitId}>
              <FormLabel>Đơn vị tính</FormLabel>
              <Select
                value={formData.unitId}
                onChange={e => setFormData(prev => ({ ...prev, unitId: e.target.value }))}
              >
                {units.map(unit => (
                  <option key={unit.id} value={unit.id}>
                    {unit.name}
                  </option>
                ))}
              </Select>
              <FormErrorMessage>{errors.unitId}</FormErrorMessage>
            </FormControl>

            <FormControl isRequired isInvalid={!!errors.price}>
              <FormLabel>Giá</FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <Icon as={FiDollarSign} color="gray.500" />
                </InputLeftElement>
                <NumberInput
                  min={0}
                  value={formData.price}
                  onChange={(valueString) => setFormData(prev => ({ 
                    ...prev, 
                    price: Number(valueString) 
                  }))}
                  width="100%"
                >
                  <NumberInputField pl={10} />
                </NumberInput>
              </InputGroup>
              <FormErrorMessage>{errors.price}</FormErrorMessage>
            </FormControl>

            <FormControl isRequired isInvalid={!!errors.quantity}>
              <FormLabel>Số lượng</FormLabel>
              <NumberInput
                min={0}
                value={formData.quantity}
                onChange={(valueString) => setFormData(prev => ({ 
                  ...prev, 
                  quantity: Number(valueString) 
                }))}
              >
                <NumberInputField />
              </NumberInput>
              <FormErrorMessage>{errors.quantity}</FormErrorMessage>
            </FormControl>

            <FormControl isRequired isInvalid={!!errors.minQuantity}>
              <FormLabel>Số lượng tối thiểu</FormLabel>
              <NumberInput
                min={0}
                value={formData.minQuantity}
                onChange={(valueString) => setFormData(prev => ({ 
                  ...prev, 
                  minQuantity: Number(valueString) 
                }))}
              >
                <NumberInputField />
              </NumberInput>
              <FormErrorMessage>{errors.minQuantity}</FormErrorMessage>
            </FormControl>

            <FormControl>
              <FormLabel>Trạng thái</FormLabel>
              <Select
                value={formData.status}
                onChange={e => setFormData(prev => ({ ...prev, status: e.target.value }))}
              >
                <option value="active">Đang bán</option>
                <option value="inactive">Ngừng bán</option>
                <option value="outOfStock">Hết hàng</option>
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Mô tả</FormLabel>
              <Textarea
                value={formData.descript}
                onChange={e => setFormData(prev => ({ ...prev, descript: e.target.value }))}
                placeholder="Nhập mô tả sản phẩm (không bắt buộc)"
                rows={3}
              />
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Hủy
          </Button>
          <Button
            colorScheme="blue"
            onClick={handleSubmit}
            isLoading={loading}
            loadingText="Đang lưu..."
          >
            Lưu thay đổi
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};