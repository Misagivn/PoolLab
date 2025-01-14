import { useState, useEffect, useRef } from 'react';
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
  Select,
  Image,
  Box,
  FormErrorMessage,
  useToast,
  Text,
} from '@chakra-ui/react';
import { BilliardTable, BilliardTableFormData } from '@/utils/types/table.types';
import { billiardTableApi } from '@/apis/table.api';
import { BilliardPrice } from '@/utils/types/billliardPrice.types';

interface BilliardTableFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: BilliardTableFormData) => Promise<void>;
  initialData?: BilliardTable;
  title: string;
  areas: Array<{ id: string; name: string }>;
  types: Array<{ id: string; name: string }>;
  prices: Array<BilliardPrice>; 
}

export const BilliardTableFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  title,
  areas,
  types,
  prices
}: BilliardTableFormModalProps) => {
  const [formData, setFormData] = useState<BilliardTableFormData>({
    name: '',
    descript: '',
    image: '',
    areaId: '',
    billiardTypeId: '',
    priceId: '',
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [loading, setLoading] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        descript: initialData.descript || '',
        image: initialData.image || '',
        areaId: initialData.areaId,
        billiardTypeId: initialData.billiardTypeId,
        priceId: initialData.priceId,
      });
    } else {
      setFormData({
        name: '',
        descript: '',
        image: '',
        areaId: '',
        billiardTypeId: '',
        priceId: '',
      });
    }
  }, [initialData, isOpen]);

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.name?.trim()) {
      newErrors.name = 'Tên bàn là bắt buộc';
    }
    if (!formData.areaId) {
      newErrors.areaId = 'Vui lòng chọn khu vực';
    }
    if (!formData.billiardTypeId) {
      newErrors.billiardTypeId = 'Vui lòng chọn loại bàn';
    }
    if (!formData.priceId) {
      newErrors.priceId = 'Vui lòng chọn giá';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await billiardTableApi.uploadImage(formData);
      if (response.status === 200) {
        setFormData(prev => ({
          ...prev,
          image: response.data
        }));
        toast({
          title: 'Thành công',
          description: 'Tải ảnh lên thành công',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Không thể tải ảnh lên',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
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
              <FormLabel>Tên bàn</FormLabel>
              <Input
                value={formData.name}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  name: e.target.value
                }))}
                placeholder="Nhập tên bàn"
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

            <FormControl isInvalid={!!errors.areaId} isRequired>
              <FormLabel>Khu vực</FormLabel>
              <Select
                value={formData.areaId}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  areaId: e.target.value
                }))}
                placeholder="Chọn khu vực"
              >
                {areas.map(area => (
                  <option key={area.id} value={area.id}>
                    {area.name}
                  </option>
                ))}
              </Select>
              <FormErrorMessage>{errors.areaId}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.billiardTypeId} isRequired>
              <FormLabel>Loại bàn</FormLabel>
              <Select
                value={formData.billiardTypeId}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  billiardTypeId: e.target.value
                }))}
                placeholder="Chọn loại bàn"
              >
                {types.map(type => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </Select>
              <FormErrorMessage>{errors.billiardTypeId}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.priceId} isRequired>
              <FormLabel>Giá</FormLabel>
              <Select
                value={formData.priceId}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  priceId: e.target.value
                }))}
                placeholder="Chọn giá"
              >
                {prices.map(price => (
                  <option key={price.id} value={price.id}>
                    {price.name} - {new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND'
                    }).format(price.oldPrice)}
                  </option>
                ))}
              </Select>
              {/* Hiển thị giá đã chọn */}
              {formData.priceId && (
                <Text mt={1} fontSize="sm" color="gray.600">
                  Giá đã chọn: {new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND'
                  }).format(prices.find(p => p.id === formData.priceId)?.oldPrice || 0)}
                </Text>
              )}
              <FormErrorMessage>{errors.priceId}</FormErrorMessage>
            </FormControl>

            <FormControl>
              <FormLabel>Hình ảnh</FormLabel>
              <Input
                type="file"
                ref={fileInputRef}
                display="none"
                accept="image/*"
                onChange={handleImageChange}
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                width="100%"
                mb={2}
              >
                Chọn ảnh
              </Button>
              {formData.image && (
                <Box borderRadius="md" overflow="hidden">
                  <Image
                    src={formData.image}
                    alt="Table preview"
                    width="100%"
                    height="auto"
                  />
                </Box>
              )}
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