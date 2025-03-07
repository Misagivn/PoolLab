import { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  VStack,
  FormErrorMessage,
  Select,
} from '@chakra-ui/react';
import { ProductGroup } from '@/utils/types/productGroup.types';
import { ProductType } from '@/utils/types/productType.types';
import { typeApi } from '@/apis/productType.api';

interface ProductGroupFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<ProductGroup, 'id'>) => Promise<void>;
  initialData?: ProductGroup;
  title: string;
}

export const ProductGroupFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  title
}: ProductGroupFormModalProps) => {
  const [formData, setFormData] = useState<Omit<ProductGroup, 'id'>>({
    name: '',
    descript: '',
    productTypeId: null
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [loading, setLoading] = useState(false);
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);

  useEffect(() => {
    const fetchProductTypes = async () => {
      try {
        const response = await typeApi.getAllTypes();
        if (response.status === 200) {
          setProductTypes(response.data);
        }
      } catch (error) {
        console.error('Error fetching product types:', error);
      }
    };

    if (isOpen) {
      fetchProductTypes();
    }
  }, [isOpen]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        descript: initialData.descript,
        productTypeId: initialData.productTypeId
      });
    } else {
      setFormData({
        name: '',
        descript: '',
        productTypeId: null
      });
    }
  }, [initialData, isOpen]);

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.name?.trim()) {
      newErrors.name = 'Tên nhóm sản phẩm là bắt buộc';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      await onSubmit(formData);
      onClose();
      setFormData({
        name: '',
        descript: '',
        productTypeId: null
      });
      setErrors({});
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <FormControl isInvalid={!!errors.name} isRequired>
              <FormLabel>Tên nhóm sản phẩm</FormLabel>
              <Input
                value={formData.name}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  name: e.target.value
                }))}
                placeholder="Nhập tên nhóm sản phẩm"
              />
              <FormErrorMessage>{errors.name}</FormErrorMessage>
            </FormControl>

            <FormControl>
              <FormLabel>Loại sản phẩm</FormLabel>
              <Select
                placeholder="Chọn loại sản phẩm"
                value={formData.productTypeId || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  productTypeId: e.target.value || null
                }))}
              >
                {productTypes.map(type => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Mô tả</FormLabel>
              <Textarea
                value={formData.descript}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  descript: e.target.value
                }))}
                placeholder="Nhập mô tả"
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
          >
            {initialData ? 'Cập nhật' : 'Thêm mới'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};