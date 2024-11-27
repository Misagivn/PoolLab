import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
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
  useToast,
  Divider,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { Area, BilliardPrice, BilliardTable, BilliardType } from '@/utils/types/table.types';

interface UpdateTableModalProps {
  isOpen: boolean;
  onClose: () => void;
  table: BilliardTable;
  onUpdate: (tableId: string, data: any, imageFile?: File) => Promise<void>;
  onUpdateStatus: (tableId: string, status: string) => Promise<void>;
  areas: Area[];
  types: BilliardType[];
  prices: BilliardPrice[];
}

export const UpdateTableModal = ({
  isOpen,
  onClose,
  table,
  onUpdate,
  onUpdateStatus,
  areas,
  types,
  prices,
}: UpdateTableModalProps) => {
  const [formData, setFormData] = useState({
    name: table.name,
    descript: table.descript,
    image: table.image,
    areaId: table.areaId,
    billiardTypeId: table.billiardTypeId,
    priceId: table.priceId,
  });
  const [status, setStatus] = useState(table.status);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(table.image);
  const toast = useToast();

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: table.name,
        descript: table.descript,
        image: table.image,
        areaId: table.areaId,
        billiardTypeId: table.billiardTypeId,
        priceId: table.priceId,
      });
      setStatus(table.status);
      setImagePreview(table.image);
      setImageFile(null);
    }
  }, [isOpen, table]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      // Update status if changed
      if (status !== table.status) {
        await onUpdateStatus(table.id, status);
      }

      // Update other information
      await onUpdate(table.id, formData, imageFile || undefined);
      
      onClose();
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Không thể cập nhật thông tin bàn',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Cập nhật thông tin bàn</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Tên bàn</FormLabel>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nhập tên bàn"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Mô tả</FormLabel>
              <Textarea
                value={formData.descript}
                onChange={(e) => setFormData({ ...formData, descript: e.target.value })}
                placeholder="Nhập mô tả"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Trạng thái</FormLabel>
              <Select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="bàn trống">Bàn trống</option>
                <option value="đang sử dụng">Đang sử dụng</option>
                <option value="đang bảo trì">Đang bảo trì</option>
              </Select>
            </FormControl>

            <Divider />

            <FormControl>
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

            <FormControl isRequired>
              <FormLabel>Khu vực</FormLabel>
              <Select
                value={formData.areaId}
                onChange={(e) => setFormData({ ...formData, areaId: e.target.value })}
              >
                {areas.map(area => (
                  <option key={area.id} value={area.id}>
                    {area.name}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Loại bàn</FormLabel>
              <Select
                value={formData.billiardTypeId}
                onChange={(e) => setFormData({ ...formData, billiardTypeId: e.target.value })}
              >
                {types.map(type => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Gói giá</FormLabel>
              <Select
                value={formData.priceId}
                onChange={(e) => setFormData({ ...formData, priceId: e.target.value })}
              >
                {prices.map(price => (
                  <option key={price.id} value={price.id}>
                    {price.name} - {price.newPrice.toLocaleString()}đ
                  </option>
                ))}
              </Select>
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
            Cập nhật
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};