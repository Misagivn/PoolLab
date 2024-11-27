import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  VStack,
  Image,
  Box,
  FormErrorMessage,
  Text,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useBilliardManager } from '@/hooks/useTable';

interface CreateTableModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateTableModal = ({ isOpen, onClose, onSuccess }: CreateTableModalProps) => {
  const { areas, types, prices, createTable } = useBilliardManager();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  
  const selectedAreaId = watch('areaId');
  const selectedArea = areas.find(area => area.id === selectedAreaId);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      if (!imageFile) throw new Error('Please select an image');
      await createTable(data, imageFile);
      onSuccess();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Thêm bàn mới</ModalHeader>
        <ModalCloseButton />
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired isInvalid={!!errors.name}>
                <FormLabel>Tên bàn</FormLabel>
                <Input 
                  {...register('name', { required: 'Tên bàn là bắt buộc' })}  
                  placeholder="Nhập tên bàn" 
                />
                <FormErrorMessage>
                  {errors.name?.message as string}
                </FormErrorMessage>
              </FormControl>

              <FormControl>
                <FormLabel>Mô tả</FormLabel>
                <Textarea 
                  {...register('descript')} 
                  placeholder="Nhập mô tả" 
                />
              </FormControl>

              <FormControl isRequired isInvalid={!!errors.areaId}>
                <FormLabel>Khu vực</FormLabel>
                <Select
                  {...register('areaId', { required: 'Vui lòng chọn khu vực' })}
                  placeholder="Chọn khu vực"
                >
                  {areas.map(area => (
                    <option key={area.id} value={area.id}>
                      {area.name}
                    </option>
                  ))}
                </Select>
                <FormErrorMessage>
                  {errors.areaId?.message as string}
                </FormErrorMessage>
              </FormControl>

              {selectedArea && (
                <Text fontSize="sm" color="gray.600">
                  Khu vực đã chọn: {selectedArea.name}
                  {selectedArea.descript && ` - ${selectedArea.descript}`}
                </Text>
              )}

              <FormControl isRequired isInvalid={!!errors.billiardTypeId}>
                <FormLabel>Loại bàn</FormLabel>
                <Select
                  {...register('billiardTypeId', { required: 'Vui lòng chọn loại bàn' })}
                  placeholder="Chọn loại bàn"
                >
                  {types.map(type => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </Select>
                <FormErrorMessage>
                  {errors.billiardTypeId?.message as string}
                </FormErrorMessage>
              </FormControl>

              <FormControl isRequired isInvalid={!!errors.priceId}>
                <FormLabel>Gói giá</FormLabel>
                <Select
                  {...register('priceId', { required: 'Vui lòng chọn gói giá' })}
                  placeholder="Chọn gói giá"
                >
                  {prices.map(price => (
                    <option key={price.id} value={price.id}>
                      {price.name} - {price.newPrice.toLocaleString()}đ
                    </option>
                  ))}
                </Select>
                <FormErrorMessage>
                  {errors.priceId?.message as string}
                </FormErrorMessage>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Hình ảnh</FormLabel>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
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
            <Button variant="ghost" mr={3} onClick={onClose}>
              Hủy
            </Button>
            <Button
              colorScheme="blue"
              type="submit"
              isLoading={loading}
              disabled={!imageFile}
            >
              Tạo bàn
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};