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
  FormControl,
  FormLabel,
  Input,
  Select,
  NumberInput,
  NumberInputField,
  VStack,
  useToast,
  Textarea,
  Image,
  Box,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { Product, UpdateProductDTO } from '@/utils/types/product';
import { useProduct } from '@/hooks/useProduct';
import { useGroup } from '@/hooks/useGroup';
import { useType } from '@/hooks/useType';
import { useUnit } from '@/hooks/useUnit';

interface ProductUpdateProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onSuccess?: () => void;
}

export const ProductUpdate: React.FC<ProductUpdateProps> = ({
  isOpen,
  onClose,
  product,
  onSuccess
}) => {
  const [imagePreview, setImagePreview] = React.useState<string>('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const { updateProduct, uploadImage } = useProduct();
  const { groups, fetchGroups } = useGroup();
  const { types, fetchTypes } = useType();
  const { units, fetchUnits } = useUnit();
  const toast = useToast();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors }
  } = useForm<UpdateProductDTO>();

  React.useEffect(() => {
    if (isOpen && product) {
      fetchGroups();
      fetchTypes();
      fetchUnits();

      setValue('name', product.name);
      setValue('descript', product.descript);
      setValue('quantity', product.quantity);
      setValue('minQuantity', product.minQuantity);
      setValue('price', product.price);
      setValue('productImg', product.productImg);
      setValue('productTypeId', product.productTypeId);
      setValue('productGroupId', product.productGroupId);
      setValue('unitId', product.unitId);
      setValue('status', product.status);
      setImagePreview(product.productImg);
    }
  }, [isOpen, product, setValue, fetchGroups, fetchTypes, fetchUnits]);

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const previewUrl = URL.createObjectURL(file);
        setImagePreview(previewUrl);

        const imageUrl = await uploadImage(file);
        setValue('productImg', imageUrl);
      } catch (error) {
        toast({
          title: 'Lỗi',
          description: 'Không thể tải lên hình ảnh',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  const onSubmit = async (data: UpdateProductDTO) => {
    if (!product?.id) return;

    try {
      setIsSubmitting(true);
      await updateProduct(product.id, data);
      onSuccess?.();
      handleClose();
    } catch (error) {
      console.error('Error in update:', error);
      // Error is handled in the hook
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    setImagePreview('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleClose}
      size="xl"
      scrollBehavior="inside"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Cập nhật sản phẩm</ModalHeader>
        <ModalCloseButton />
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired isInvalid={!!errors.name}>
                <FormLabel>Tên sản phẩm</FormLabel>
                <Input {...register('name', { required: 'Vui lòng nhập tên sản phẩm' })} />
              </FormControl>

              <FormControl>
                <FormLabel>Mô tả</FormLabel>
                <Textarea {...register('descript')} />
              </FormControl>

              <FormControl isRequired isInvalid={!!errors.productTypeId}>
                <FormLabel>Loại sản phẩm</FormLabel>
                <Select {...register('productTypeId', { required: 'Vui lòng chọn loại sản phẩm' })}>
                  {types.map((type) => (
                    <option key={type.id} value={type.id}>{type.name}</option>
                  ))}
                </Select>
              </FormControl>

              <FormControl isRequired isInvalid={!!errors.productGroupId}>
                <FormLabel>Nhóm sản phẩm</FormLabel>
                <Select {...register('productGroupId', { required: 'Vui lòng chọn nhóm sản phẩm' })}>
                  {groups.map((group) => (
                    <option key={group.id} value={group.id}>{group.name}</option>
                  ))}
                </Select>
              </FormControl>

              <FormControl isRequired isInvalid={!!errors.unitId}>
                <FormLabel>Đơn vị tính</FormLabel>
                <Select {...register('unitId', { required: 'Vui lòng chọn đơn vị tính' })}>
                  {units.map((unit) => (
                    <option key={unit.id} value={unit.id}>{unit.name}</option>
                  ))}
                </Select>
              </FormControl>

              <FormControl isRequired isInvalid={!!errors.quantity}>
                <FormLabel>Số lượng</FormLabel>
                <NumberInput min={0}>
                  <NumberInputField {...register('quantity', { 
                    required: 'Vui lòng nhập số lượng',
                    min: { value: 0, message: 'Số lượng không được âm' }
                  })} />
                </NumberInput>
              </FormControl>

              <FormControl isRequired isInvalid={!!errors.minQuantity}>
                <FormLabel>Số lượng tối thiểu</FormLabel>
                <NumberInput min={0}>
                  <NumberInputField {...register('minQuantity', {
                    required: 'Vui lòng nhập số lượng tối thiểu',
                    min: { value: 0, message: 'Số lượng tối thiểu không được âm' }
                  })} />
                </NumberInput>
              </FormControl>

              <FormControl isRequired isInvalid={!!errors.price}>
                <FormLabel>Giá</FormLabel>
                <NumberInput min={0}>
                  <NumberInputField {...register('price', {
                    required: 'Vui lòng nhập giá',
                    min: { value: 0, message: 'Giá không được âm' }
                  })} />
                </NumberInput>
              </FormControl>

              <FormControl isRequired isInvalid={!!errors.status}>
                <FormLabel>Trạng thái</FormLabel>
                <Select {...register('status', { required: 'Vui lòng chọn trạng thái' })}>
                  <option value="Còn Hàng">Còn Hàng</option>
                  <option value="Hết Hàng">Hết Hàng</option>
                  <option value="Sắp Hết">Sắp Hết</option>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Hình ảnh sản phẩm</FormLabel>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  ref={fileInputRef}
                  display="none"
                />
                <Button onClick={() => fileInputRef.current?.click()}>
                  Chọn hình ảnh
                </Button>
                {imagePreview && (
                  <Box mt={2}>
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      maxH="200px"
                      objectFit="cover"
                      borderRadius="md"
                    />
                  </Box>
                )}
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={handleClose}>
              Hủy
            </Button>
            <Button
              colorScheme="blue"
              type="submit"
              isLoading={isSubmitting}
              loadingText="Đang cập nhật..."
            >
              Cập nhật
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};