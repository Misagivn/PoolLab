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
  HStack,
} from '@chakra-ui/react';
import { Event } from '@/utils/types/event.types';
import { eventApi } from '@/apis/event.api';
import { useAccountInfo } from '@/hooks/useAccountInfo';

interface EventFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Event>) => Promise<void>;
  initialData?: Event;
  title: string;
}

export const EventFormModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialData,
  title 
}: EventFormModalProps) => {
  const { managerData } = useAccountInfo();
  const [formData, setFormData] = useState<Partial<Event>>({
    title: '',
    descript: '',
    thumbnail: '',
    managerId: managerData?.id || '',
    storeId: null,
    timeStart: '',
    timeEnd: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  const formatDateForInput = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16);
  };

  const formatDateForSubmit = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}T${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        descript: initialData.descript || '',
        thumbnail: initialData.thumbnail || '',
        managerId: managerData?.id || '',
        storeId: initialData.storeId || null,
        timeStart: initialData.timeStart ? formatDateForInput(initialData.timeStart) : '',
        timeEnd: initialData.timeEnd ? formatDateForInput(initialData.timeEnd) : '',
      });
    } else {
      setFormData({
        title: '',
        descript: '',
        thumbnail: '',
        managerId: managerData?.id || '',
        storeId: null,
        timeStart: '',
        timeEnd: '',
      });
    }
  }, [initialData, isOpen, managerData]);

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.title?.trim()) {
      newErrors.title = 'Tiêu đề là bắt buộc';
    }
    if (!formData.descript?.trim()) {
      newErrors.descript = 'Mô tả là bắt buộc';
    }
    if (!formData.timeStart) {
      newErrors.timeStart = 'Thời gian bắt đầu là bắt buộc';
    }
    if (!formData.timeEnd) {
      newErrors.timeEnd = 'Thời gian kết thúc là bắt buộc';
    }
    if (formData.timeStart && formData.timeEnd && new Date(formData.timeStart) >= new Date(formData.timeEnd)) {
      newErrors.timeEnd = 'Thời gian kết thúc phải sau thời gian bắt đầu';
    }
    if (!managerData?.id) {
      newErrors.managerId = 'Không thể xác định người tạo sự kiện';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    if (!managerData?.id) {
      toast({
        title: 'Lỗi',
        description: 'Không thể xác định người tạo sự kiện',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setLoading(true);
      const submitData = {
        ...formData,
        managerId: managerData.id,
        timeStart: formatDateForSubmit(formData.timeStart!),
        timeEnd: formatDateForSubmit(formData.timeEnd!)
      };

      console.log('Submitting data:', submitData);
      await onSubmit(submitData);
      onClose();
      setFormData({
        title: '',
        descript: '',
        thumbnail: '',
        managerId: managerData.id,
        storeId: null,
        timeStart: '',
        timeEnd: '',
      });
      setErrors({});
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: 'Lỗi',
        description: 'Có lỗi xảy ra khi lưu sự kiện',
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
      
      const response = await eventApi.uploadEventImage(formData);
      if (response.status === 200) {
        setFormData(prev => ({
          ...prev,
          thumbnail: response.data as string
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
            <FormControl isInvalid={!!errors.title} isRequired>
              <FormLabel>Tiêu đề</FormLabel>
              <Input 
                value={formData.title}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  title: e.target.value
                }))}
                placeholder="Nhập tiêu đề sự kiện"
              />
              <FormErrorMessage>{errors.title}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.descript} isRequired>
              <FormLabel>Mô tả</FormLabel>
              <Textarea 
                value={formData.descript}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  descript: e.target.value
                }))}
                placeholder="Nhập mô tả sự kiện"
                rows={4}
              />
              <FormErrorMessage>{errors.descript}</FormErrorMessage>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Thời gian</FormLabel>
              <HStack>
                <FormControl isInvalid={!!errors.timeStart}>
                  <Input
                    type="datetime-local"
                    value={formData.timeStart}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      timeStart: e.target.value
                    }))}
                  />
                  <FormErrorMessage>{errors.timeStart}</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={!!errors.timeEnd}>
                  <Input
                    type="datetime-local"
                    value={formData.timeEnd}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      timeEnd: e.target.value
                    }))}
                  />
                  <FormErrorMessage>{errors.timeEnd}</FormErrorMessage>
                </FormControl>
              </HStack>
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
              {formData.thumbnail && (
                <Box borderRadius="md" overflow="hidden">
                  <Image
                    src={formData.thumbnail}
                    alt="Event preview"
                    width="100%"
                    height="auto"
                    maxH="200px"
                    objectFit="cover"
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