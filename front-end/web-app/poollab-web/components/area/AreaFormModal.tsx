import { useRef, useState } from 'react';
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
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.descript || '');
  const [imageUrl, setImageUrl] = useState(initialData?.areaImg || '');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    if (!name.trim()) {
      newErrors.name = 'Tên khu vực là bắt buộc';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      await onSubmit({
        name,
        descript: description,
        areaImg: imageUrl,
        storeId: initialData?.storeId
      });
      onClose();
      setName('');
      setDescription('');
      setImageUrl('');
      setErrors({});
    } catch (error) {
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
      
      const response = await fetch(
        'https://poollabwebapi20241008201316.azurewebsites.net/api/Area/UploadAreaImg',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: formData
        }
      );
      
      const result = await response.json();
      if (result.status === 200) {
        setImageUrl(result.data);
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
            <FormControl isRequired isInvalid={!!errors.name}>
              <FormLabel>Tên khu vực</FormLabel>
              <Input 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nhập tên khu vực"
              />
              <FormErrorMessage>{errors.name}</FormErrorMessage>
            </FormControl>

            <FormControl>
              <FormLabel>Mô tả</FormLabel>
              <Textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
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
              {imageUrl && (
                <Box borderRadius="md" overflow="hidden">
                  <Image
                    src={imageUrl}
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