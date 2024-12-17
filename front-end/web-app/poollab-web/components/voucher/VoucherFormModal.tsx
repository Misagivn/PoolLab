import { useRef, useState, useEffect } from 'react';
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
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';
import { Voucher } from '@/utils/types/voucher.types';

interface VoucherFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Pick<Voucher, 'name' | 'description' | 'point' | 'discount'>) => Promise<void>;
  initialData?: Voucher;
  title: string;
}

export const VoucherFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  title
}: VoucherFormModalProps) => {
  const [formData, setFormData] = useState<Pick<Voucher, 'name' | 'description' | 'point' | 'discount'>>({
    name: '',
    description: '',
    point: 0,
    discount: 0,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        description: initialData.description || '',
        point: initialData.point || 0,
        discount: initialData.discount || 0,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        point: 0,
        discount: 0,
      });
    }
  }, [initialData, isOpen]);

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.name?.trim()) {
      newErrors.name = 'Tên voucher là bắt buộc';
    }
    if (!formData.description?.trim()) {
      newErrors.description = 'Mô tả là bắt buộc';
    }
    if (formData.point < 0) {
      newErrors.point = 'Điểm không được âm';
    }
    if (formData.discount <= 0 || formData.discount > 100) {
      newErrors.discount = 'Giảm giá phải từ 1-100%';
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
              <FormLabel>Tên voucher</FormLabel>
              <Input
                value={formData.name}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  name: e.target.value
                }))}
                placeholder="Nhập tên voucher"
              />
              <FormErrorMessage>{errors.name}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.description} isRequired>
              <FormLabel>Mô tả</FormLabel>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  description: e.target.value
                }))}
                placeholder="Nhập mô tả voucher"
              />
              <FormErrorMessage>{errors.description}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.point} isRequired>
              <FormLabel>Điểm đổi</FormLabel>
              <NumberInput
                min={0}
                value={formData.point}
                onChange={(valueString) => setFormData(prev => ({
                  ...prev,
                  point: parseInt(valueString)
                }))}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              <FormErrorMessage>{errors.point}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.discount} isRequired>
              <FormLabel>Phần trăm giảm giá</FormLabel>
              <NumberInput
                min={1}
                max={100}
                value={formData.discount}
                onChange={(valueString) => setFormData(prev => ({
                  ...prev,
                  discount: parseInt(valueString)
                }))}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              <FormErrorMessage>{errors.discount}</FormErrorMessage>
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