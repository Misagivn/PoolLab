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
import { CreateProductDTO } from '@/utils/types/product.types';
import { useProduct } from '@/hooks/useProduct';
import { useGroup } from '@/hooks/useGroup';
import { useType } from '@/hooks/useType';
import { useUnit } from '@/hooks/useUnit';

interface ProductCreateProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const ProductCreate: React.FC<ProductCreateProps> = ({ 
  isOpen, 
  onClose,
  onSuccess 
}) => {
  const [imagePreview, setImagePreview] = React.useState<string>('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const { createProduct, uploadImage } = useProduct();
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
  } = useForm<CreateProductDTO>();

  React.useEffect(() => {
    if (isOpen) {
      fetchGroups();
      fetchTypes();
      fetchUnits();
    }
  }, [isOpen]);

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

  const onSubmit = async (data: CreateProductDTO) => {
    try {
      setIsSubmitting(true);
      await createProduct(data);
      toast({
        title: 'Thành công',
        description: 'Thêm sản phẩm mới thành công',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onSuccess?.();
      handleClose();
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Không thể tạo sản phẩm',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    setImagePreview('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Thêm sản phẩm mới</ModalHeader>
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
                  <option value="">Chọn loại sản phẩm</option>
                  {types.map((type) => (
                    <option key={type.id} value={type.id}>{type.name}</option>
                  ))}
                </Select>
              </FormControl>

              <FormControl isRequired isInvalid={!!errors.productGroupId}>
                <FormLabel>Nhóm sản phẩm</FormLabel>
                <Select {...register('productGroupId', { required: 'Vui lòng chọn nhóm sản phẩm' })}>
                  <option value="">Chọn nhóm sản phẩm</option>
                  {groups.map((group) => (
                    <option key={group.id} value={group.id}>{group.name}</option>
                  ))}
                </Select>
              </FormControl>

              <FormControl isRequired isInvalid={!!errors.unitId}>
                <FormLabel>Đơn vị tính</FormLabel>
                <Select {...register('unitId', { required: 'Vui lòng chọn đơn vị tính' })}>
                  <option value="">Chọn đơn vị tính</option>
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
              loadingText="Đang tạo..."
            >
              Tạo sản phẩm
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};