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
  VStack,
  FormErrorMessage,
  useToast,
 } from '@chakra-ui/react';
 import { useState } from 'react';
 
 interface EditInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentInfo: {
    email: string;
    avatarUrl: string;
    userName: string;
    fullName: string;
    phoneNumber: string;
  };
  onSubmit: (data: any) => Promise<void>;
 }
 
 export const EditInfoModal = ({
  isOpen,
  onClose,
  currentInfo,
  onSubmit,
 }: EditInfoModalProps) => {
  const [formData, setFormData] = useState(currentInfo);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
 
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
 
    // Validate
    if (!formData.email.endsWith('@gmail.com')) {
      newErrors.email = 'Email phải kết thúc bằng @gmail.com';
    }
 
    if (/[\s\u0300-\u036f]/.test(formData.userName)) {
      newErrors.userName = 'Tên tài khoản không được chứa dấu hoặc khoảng trắng';
    }

    if (!/^\d{10,11}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Số điện thoại phải có 10-11 chữ số';
    }
 
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
 
  const handleSubmit = async () => {
    if (!validateForm()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng kiểm tra lại thông tin",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
 
    setIsLoading(true);
    try {
      await onSubmit(formData);
      onClose();
    } finally {
      setIsLoading(false);
    }
  };
 
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Chỉnh sửa thông tin</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <FormControl isInvalid={!!errors.email}>
              <FormLabel>Email</FormLabel>
              <Input
                value={formData.email}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, email: e.target.value }));
                  if (errors.email) {
                    setErrors((prev) => ({ ...prev, email: '' }));
                  }
                }}
              />
              <FormErrorMessage>{errors.email}</FormErrorMessage>
            </FormControl>
 
            <FormControl>
              <FormLabel>Họ và tên</FormLabel>
              <Input
                value={formData.fullName}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, fullName: e.target.value }))
                }
              />
            </FormControl>
 
            <FormControl isInvalid={!!errors.userName}>
              <FormLabel>Tên tài khoản</FormLabel>
              <Input
                value={formData.userName}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, userName: e.target.value }));
                  if (errors.userName) {
                    setErrors((prev) => ({ ...prev, userName: '' }));
                  }
                }}
              />
              <FormErrorMessage>{errors.userName}</FormErrorMessage>
            </FormControl>
 
            <FormControl isInvalid={!!errors.phoneNumber}>
              <FormLabel>Số điện thoại</FormLabel>
              <Input
                value={formData.phoneNumber}
                onChange={(e) => {
                  const value = e.target.value;
                  // Chỉ cho phép nhập số
                  if (value === '' || /^\d+$/.test(value)) {
                    setFormData((prev) => ({ ...prev, phoneNumber: value }));
                    if (errors.phoneNumber) {
                      setErrors((prev) => ({ ...prev, phoneNumber: '' }));
                    }
                  }
                }}
                maxLength={11}
              />
              <FormErrorMessage>{errors.phoneNumber}</FormErrorMessage>
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
            isLoading={isLoading}
          >
            Lưu thay đổi
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
 };