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
import { BilliardPrice } from '@/utils/types/table.types';
import { BilliardPriceFormData } from '@/utils/types/billliardPrice.types';

interface BilliardPriceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: BilliardPriceFormData) => Promise<void>;
  initialData?: BilliardPrice;
  title: string;
}

export const BilliardPriceFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  title
}: BilliardPriceFormModalProps) => {
  const [formData, setFormData] = useState<BilliardPriceFormData>({
    name: '',
    descript: '',
    oldPrice: 0,
    timeStart: new Date().toISOString(),
    timeEnd: new Date().toISOString(),
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        descript: initialData.descript || '',
        oldPrice: initialData.oldPrice,
        timeStart: initialData.timeStart,
        timeEnd: initialData.timeEnd,
      });
    } else {
      setFormData({
        name: '',
        descript: '',
        oldPrice: 0,
        timeStart: new Date().toISOString(),
        timeEnd: new Date().toISOString(),
      });
    }
  }, [initialData, isOpen]);

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.name?.trim()) {
      newErrors.name = 'Tên giá là bắt buộc';
    }
    if (formData.oldPrice < 0) {
      newErrors.oldPrice = 'Giá không thể âm';
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
        oldPrice: 0,
        timeStart: new Date().toISOString(),
        timeEnd: new Date().toISOString(),
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
              <FormLabel>Tên giá</FormLabel>
              <Input
                value={formData.name}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  name: e.target.value
                }))}
                placeholder="Nhập tên giá"
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

            <FormControl isInvalid={!!errors.oldPrice} isRequired>
              <FormLabel>Giá tiền</FormLabel>
              <Input
                type="number"
                value={formData.oldPrice}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  oldPrice: Number(e.target.value)
                }))}
                placeholder="Nhập giá tiền"
              />
              <FormErrorMessage>{errors.oldPrice}</FormErrorMessage>
            </FormControl>

            <FormControl>
              <FormLabel>Thời gian bắt đầu</FormLabel>
              <Input
                type="datetime-local"
                value={formData.timeStart.split('.')[0]}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  timeStart: new Date(e.target.value).toISOString()
                }))}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Thời gian kết thúc</FormLabel>
              <Input
                type="datetime-local"
                value={formData.timeEnd.split('.')[0]}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  timeEnd: new Date(e.target.value).toISOString()
                }))}
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