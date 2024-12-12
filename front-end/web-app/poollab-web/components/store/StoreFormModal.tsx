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
  Image,
  Box,
  useToast,
  FormErrorMessage,
  InputGroup,
  HStack,
} from '@chakra-ui/react';
import { Store } from '@/utils/types/store';
import { storeApi } from '@/apis/store.api';

interface StoreFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Store>) => Promise<void>;
  initialData?: Store;
  title: string;
}

export const StoreFormModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialData,
  title 
}: StoreFormModalProps) => {
  const [formData, setFormData] = useState<Partial<Store>>({
    name: '',
    address: '',
    storeImg: '',
    descript: '',
    phoneNumber: '',
    timeStart: '',
    timeEnd: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const validatePhoneNumber = (value: string) => {
    return value.replace(/[^0-9]/g, '');
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const validatedValue = validatePhoneNumber(e.target.value);
    setFormData(prev => ({
      ...prev,
      phoneNumber: validatedValue
    }));

    if (validatedValue && validatedValue.length < 10) {
      setErrors(prev => ({
        ...prev,
        phoneNumber: 'Số điện thoại phải có ít nhất 10 số'
      }));
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.phoneNumber;
        return newErrors;
      });
    }
  };
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        address: initialData.address || '',
        storeImg: initialData.storeImg || '',
        descript: initialData.descript || '',
        phoneNumber: initialData.phoneNumber || '',
        timeStart: initialData.timeStart || '',
        timeEnd: initialData.timeEnd || '',
      });
    } else {
      setFormData({
        name: '',
        address: '',
        storeImg: '',
        descript: '',
        phoneNumber: '',
        timeStart: '',
        timeEnd: '',
      });
    }
  }, [initialData, isOpen]);

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.name?.trim()) {
      newErrors.name = 'Tên cửa hàng là bắt buộc';
    }
    if (!formData.address?.trim()) {
      newErrors.address = 'Địa chỉ là bắt buộc';
    }
    if (!formData.phoneNumber?.trim()) {
      newErrors.phoneNumber = 'Số điện thoại là bắt buộc';
    } else if (formData.phoneNumber.length < 10) {
      newErrors.phoneNumber = 'Số điện thoại không hợp lệ';
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
        address: '',
        storeImg: '',
        descript: '',
        phoneNumber: '',
        timeStart: '',
        timeEnd: '',
      });
      setErrors({});
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await storeApi.uploadStoreImage(formData);
      if (response.status === 200) {
        setFormData(prev => ({
          ...prev,
          storeImg: response.data as string
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

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <FormControl isInvalid={!!errors.name} isRequired>
              <FormLabel>Tên cửa hàng</FormLabel>
              <Input 
                value={formData.name}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  name: e.target.value
                }))}
                placeholder="Nhập tên cửa hàng"
              />
              <FormErrorMessage>{errors.name}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.address} isRequired>
              <FormLabel>Địa chỉ</FormLabel>
              <Input 
                value={formData.address}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  address: e.target.value
                }))}
                placeholder="Nhập địa chỉ"
              />
              <FormErrorMessage>{errors.address}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.phoneNumber} isRequired>
            <FormLabel>Số điện thoại</FormLabel>
            <Input 
              value={formData.phoneNumber}
              onChange={handlePhoneNumberChange}
              placeholder="Nhập số điện thoại"
              type="tel" 
              maxLength={11} 
              onKeyPress={(e) => {
                if (!/[0-9]/.test(e.key)) {
                  e.preventDefault();
                }
              }}
            />
            <FormErrorMessage>{errors.phoneNumber}</FormErrorMessage>
          </FormControl>

            <FormControl>
              <FormLabel>Thời gian hoạt động</FormLabel>
              <HStack>
                <Input
                  type="time"
                  value={formData.timeStart || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    timeStart: e.target.value
                  }))}
                />
                <Input
                  type="time"
                  value={formData.timeEnd || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    timeEnd: e.target.value
                  }))}
                />
              </HStack>
            </FormControl>

            <FormControl>
              <FormLabel>Mô tả</FormLabel>
              <Textarea 
                value={formData.descript}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  descript: e.target.value
                }))}
                placeholder="Nhập mô tả cửa hàng"
              />
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
              {formData.storeImg && (
                <Box borderRadius="md" overflow="hidden">
                  <Image
                    src={formData.storeImg}
                    alt="Store preview"
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