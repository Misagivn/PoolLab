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
} from '@chakra-ui/react';
import { Area } from '@/utils/types/area.types';
import { areaApi } from '@/apis/area.api';

interface AreaFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Area>) => Promise<void>;
  initialData?: Area;
  title: string;
}

export const AreaFormModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialData,
  title 
}: AreaFormModalProps) => {
  const [formData, setFormData] = useState<Partial<Area>>({
    name: '',
    descript: '',
    areaImg: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  // Load initial data when editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        descript: initialData.descript || '',
        areaImg: initialData.areaImg || '',
        storeId: initialData.storeId
      });
    } else {
      // Reset form for new area
      setFormData({
        name: '',
        descript: '',
        areaImg: '',
      });
    }
  }, [initialData, isOpen]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      // Basic validation
      if (!formData.name?.trim()) {
        setErrors({ name: 'Tên khu vực là bắt buộc' });
        return;
      }
  
      // Prepare data for submission
      const submitData: Partial<Area> = {
        name: formData.name.trim(),
        descript: formData.descript?.trim() || '',
        areaImg: formData.areaImg || '',
        storeId: initialData?.storeId || formData.storeId
      };
  
      await onSubmit(submitData);
      onClose();
      setFormData({
        name: '',
        descript: '',
        areaImg: '',
      });
      setErrors({});
    } catch (error) {
      console.error('Form submission error:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể lưu thông tin khu vực',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
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
      
      const response = await areaApi.uploadAreaImage(formData);
      if (response.status === 200) {
        setFormData(prev => ({
          ...prev,
          areaImg: response.data as string
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
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <FormControl isInvalid={!!errors.name} isRequired={!initialData}>
              <FormLabel>Tên khu vực</FormLabel>
              <Input 
                value={formData.name}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  name: e.target.value
                }))}
                placeholder="Nhập tên khu vực"
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
                placeholder="Nhập mô tả khu vực"
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
              {formData.areaImg && (
                <Box borderRadius="md" overflow="hidden">
                  <Image
                    src={formData.areaImg}
                    alt="Area preview"
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