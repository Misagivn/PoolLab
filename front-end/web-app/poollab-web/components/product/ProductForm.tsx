'use client';

import { useEffect, useState, useRef } from 'react';
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
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Textarea,
  Button,
  VStack,
  Image,
  Box,
  useToast,
} from '@chakra-ui/react';
import { Product } from '@/utils/types/product';

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
  groups: any[];
  types: any[];
  units: any[];
  onSubmit: (data: any) => Promise<void>;
}

export const ProductForm = ({
  isOpen,
  onClose,
  product,
  groups,
  types,
  units,
  onSubmit
}: ProductFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    descript: '',
    quantity: '0',
    minQuantity: '0',
    price: '0',
    productImg: '',
    productTypeId: '',
    productGroupId: '',
    unitId: '',
    status: 'Còn Hàng'
  });
  
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        descript: product.descript || '',
        quantity: String(product.quantity || 0),
        minQuantity: String(product.minQuantity || 0),
        price: String(product.price || 0),
        productImg: product.productImg || '',
        productTypeId: product.productTypeId || '',
        productGroupId: product.productGroupId || '',
        unitId: product.unitId || '',
        status: product.status || 'Còn Hàng'
      });
    } else {
      setFormData({
        name: '',
        descript: '',
        quantity: '0',
        minQuantity: '0',
        price: '0',
        productImg: '',
        productTypeId: '',
        productGroupId: '',
        unitId: '',
        status: 'Còn Hàng'
      });
    }
  }, [product]);

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng nhập tên sản phẩm',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return false;
    }

    if (!formData.productTypeId) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng chọn loại sản phẩm',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return false;
    }

    if (!formData.productGroupId) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng chọn nhóm sản phẩm',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return false;
    }

    if (!formData.unitId) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng chọn đơn vị tính',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return false;
    }

    if (parseInt(formData.price) <= 0) {
      toast({
        title: 'Lỗi',
        description: 'Giá sản phẩm phải lớn hơn 0',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return false;
    }

    return true;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNumberInputChange = (name: string, valueAsString: string, valueAsNumber: number) => {
    setFormData(prev => ({
      ...prev,
      [name]: valueAsString
    }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch(
        'https://poollabwebapi20241008201316.azurewebsites.net/api/product/uploadfileproductimg',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
          body: formData
        }
      );

      const result = await response.json();
      console.log('Upload image result:', result);
      
      if (result.status === 200) {
        setFormData(prev => ({
          ...prev,
          productImg: result.data
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
      console.error('Upload image error:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể tải ảnh lên',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const dataToSubmit = {
        name: formData.name,
        descript: formData.descript,
        quantity: parseInt(formData.quantity),
        minQuantity: parseInt(formData.minQuantity),
        price: parseInt(formData.price),
        productImg: formData.productImg,
        productTypeId: formData.productTypeId,
        productGroupId: formData.productGroupId,
        unitId: formData.unitId,
        status: formData.status,
        // Nếu là cập nhật, sử dụng các giá trị hiện tại nếu không có thay đổi
        ...(product && {
          productTypeId: formData.productTypeId || product.productTypeId,
          productGroupId: formData.productGroupId || product.productGroupId,
          unitId: formData.unitId || product.unitId,
        })
      };

      console.log('Submitting data:', dataToSubmit);
      
      await onSubmit(dataToSubmit);
      // Đợi server xử lý
      await new Promise(resolve => setTimeout(resolve, 500));
      onClose();
      // Tải lại trang để cập nhật dữ liệu mới
      window.location.reload();
    } catch (error) {
      console.error('Submit error:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể lưu sản phẩm. Vui lòng thử lại',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {product ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm mới'}
        </ModalHeader>
        <ModalCloseButton />
        
        <form onSubmit={handleSubmit}>
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Tên sản phẩm</FormLabel>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Nhập tên sản phẩm"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Mô tả</FormLabel>
                <Textarea
                  name="descript"
                  value={formData.descript}
                  onChange={handleInputChange}
                  placeholder="Nhập mô tả sản phẩm"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Loại sản phẩm</FormLabel>
                <Select
                  name="productTypeId"
                  value={formData.productTypeId}
                  onChange={handleInputChange}
                  placeholder="Chọn loại sản phẩm"
                >
                  {types.map(type => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Nhóm sản phẩm</FormLabel>
                <Select
                  name="productGroupId"
                  value={formData.productGroupId}
                  onChange={handleInputChange}
                  placeholder="Chọn nhóm sản phẩm"
                >
                  {groups.map(group => (
                    <option key={group.id} value={group.id}>
                      {group.name}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Đơn vị tính</FormLabel>
                <Select
                  name="unitId"
                  value={formData.unitId}
                  onChange={handleInputChange}
                  placeholder="Chọn đơn vị tính"
                >
                  {units.map(unit => (
                    <option key={unit.id} value={unit.id}>
                      {unit.name}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Số lượng</FormLabel>
                <NumberInput
                  min={0}
                  value={formData.quantity}
                  onChange={(valueString, valueNumber) => 
                    handleNumberInputChange('quantity', valueString, valueNumber)
                  }
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Số lượng tối thiểu</FormLabel>
                <NumberInput
                  min={0}
                  value={formData.minQuantity}
                  onChange={(valueString, valueNumber) => 
                    handleNumberInputChange('minQuantity', valueString, valueNumber)
                  }
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Giá</FormLabel>
                <NumberInput
                  min={0}
                  value={formData.price}
                  onChange={(valueString, valueNumber) => 
                    handleNumberInputChange('price', valueString, valueNumber)
                  }
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>

              <FormControl>
                <FormLabel>Hình ảnh</FormLabel>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  display="none"
                  ref={fileInputRef}
                />
                <Button onClick={() => fileInputRef.current?.click()} width="100%" mb={2}>
                  Chọn ảnh
                </Button>
                {formData.productImg && (
                  <Box borderRadius="md" overflow="hidden">
                    <Image
                      src={formData.productImg}
                      alt="Product preview"
                      width="100%"
                      height="auto"
                    />
                  </Box>
                )}
              </FormControl>

              {product && (
                <FormControl>
                  <FormLabel>Trạng thái</FormLabel>
                  <Select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <option value="Còn Hàng">Còn Hàng</option>
                    <option value="Hết Hàng">Hết Hàng</option>
                    <option value="Ngừng Kinh Doanh">Ngừng Kinh Doanh</option>
                  </Select>
                </FormControl>
              )}
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
            >
              {product ? 'Cập nhật' : 'Thêm mới'}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};