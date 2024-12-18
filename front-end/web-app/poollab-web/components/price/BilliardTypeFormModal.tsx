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
} from '@chakra-ui/react';
import { BilliardType } from '@/utils/types/table.types';

interface BilliardTypeFormData {
  name: string;
  descript: string;
  image: string;
}

interface BilliardTypeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: BilliardTypeFormData) => Promise<void>;
  initialData?: BilliardType;
  title: string;
}

export const BilliardTypeFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  title
}: BilliardTypeFormModalProps) => {
  const [formData, setFormData] = useState<BilliardTypeFormData>({
    name: '',
    descript: '',
    image: '',
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        descript: initialData.descript || '',
        image: initialData.image || '',
      });
    } else {
      setFormData({
        name: '',
        descript: '',
        image: '',
      });
    }
  }, [initialData, isOpen]);

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.name?.trim()) {
      newErrors.name = 'Tên loại bàn là bắt buộc';
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
        image: '',
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
              <FormLabel>Tên loại bàn</FormLabel>
              <Input
                value={formData.name}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  name: e.target.value
                }))}
                placeholder="Nhập tên loại bàn"
              />
              <FormErrorMessage>{errors.name}</FormErrorMessage>
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

            <FormControl>
              <FormLabel>Hình ảnh</FormLabel>
              <Input
                value={formData.image}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  image: e.target.value
                }))}
                placeholder="Nhập đường dẫn hình ảnh"
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