'use client';

import { useState, useRef } from 'react';
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
  Button,
  VStack,
  Avatar,
  Box,
  useToast,
  FormErrorMessage,
  InputGroup,
  InputRightElement,
  IconButton,
  Icon,
  Text,
} from '@chakra-ui/react';
import { FiEye, FiEyeOff, FiCamera, FiUpload } from 'react-icons/fi';
import { useStaff } from '@/hooks/useStaff';
import { StaffFormData } from '@/utils/types/staff.types';

interface StaffFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const initialFormData: StaffFormData = {
  email: '',
  userName: '',
  passwordHash: '',
  fullName: '',
  phoneNumber: '',
  avatarUrl: '',
};

export const StaffFormModal = ({ isOpen, onClose }: StaffFormModalProps) => {
  const { createStaff } = useStaff();
  const [formData, setFormData] = useState<StaffFormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  const resetForm = () => {
    setFormData(initialFormData);
    setErrors({});
    setShowPassword(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email là bắt buộc';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    // Username validation
    if (!formData.userName) {
      newErrors.userName = 'Tên đăng nhập là bắt buộc';
    } else if (formData.userName.length < 3) {
      newErrors.userName = 'Tên đăng nhập phải có ít nhất 3 ký tự';
    }

    // Full name validation
    if (!formData.fullName) {
      newErrors.fullName = 'Họ và tên là bắt buộc';
    } else if (formData.fullName.length < 2) {
      newErrors.fullName = 'Họ và tên phải có ít nhất 2 ký tự';
    }

    // Password validation
    if (!formData.passwordHash) {
      newErrors.passwordHash = 'Mật khẩu là bắt buộc';
    } else if (formData.passwordHash.length < 6) {
      newErrors.passwordHash = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    // Phone number validation (optional but must be valid if provided)
    if (formData.phoneNumber && !/^[0-9]{10,11}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Số điện thoại không hợp lệ (phải có 10-11 số)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      await createStaff(formData);
      toast({
        title: 'Thành công',
        description: 'Thêm nhân viên mới thành công',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      handleClose();
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error instanceof Error ? error.message : 'Không thể thêm nhân viên mới',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng chọn file hình ảnh',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'Lỗi',
        description: 'Kích thước ảnh không được vượt quá 5MB',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch(
        'https://poollabwebapi20241008201316.azurewebsites.net/api/Account/UploadFileAvatar',
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
        setFormData(prev => ({ ...prev, avatarUrl: result.data }));
        toast({
          title: 'Thành công',
          description: 'Tải ảnh đại diện lên thành công',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        throw new Error(result.message || 'Upload failed');
      }
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Không thể tải ảnh đại diện lên',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      closeOnOverlayClick={false}
      size="md"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Thêm nhân viên mới</ModalHeader>
        <ModalCloseButton />
        
        <ModalBody>
          <VStack spacing={4}>
            {/* Avatar Upload Section */}
            <Box position="relative" alignSelf="center">
              <input
                type="file"
                ref={fileInputRef}
                hidden
                accept="image/*"
                onChange={handleImageUpload}
              />
              <Avatar
                size="2xl"
                src={formData.avatarUrl}
                name={formData.fullName || "Avatar"}
              />
              <IconButton
                aria-label="Upload avatar"
                icon={<Icon as={uploading ? FiUpload : FiCamera} />}
                size="sm"
                colorScheme="blue"
                rounded="full"
                position="absolute"
                bottom="0"
                right="0"
                onClick={() => fileInputRef.current?.click()}
                isLoading={uploading}
              />
            </Box>

            {/* Email Field */}
            <FormControl isRequired isInvalid={!!errors.email}>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                value={formData.email}
                onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Nhập email"
              />
              <FormErrorMessage>{errors.email}</FormErrorMessage>
            </FormControl>

            {/* Username Field */}
            <FormControl isRequired isInvalid={!!errors.userName}>
              <FormLabel>Tên đăng nhập</FormLabel>
              <Input
                value={formData.userName}
                onChange={e => setFormData(prev => ({ ...prev, userName: e.target.value }))}
                placeholder="Nhập tên đăng nhập"
              />
              <FormErrorMessage>{errors.userName}</FormErrorMessage>
            </FormControl>

            {/* Full Name Field */}
            <FormControl isRequired isInvalid={!!errors.fullName}>
              <FormLabel>Họ và tên</FormLabel>
              <Input
                value={formData.fullName}
                onChange={e => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                placeholder="Nhập họ và tên"
              />
              <FormErrorMessage>{errors.fullName}</FormErrorMessage>
            </FormControl>

            {/* Password Field */}
            <FormControl isRequired isInvalid={!!errors.passwordHash}>
              <FormLabel>Mật khẩu</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.passwordHash}
                  onChange={e => setFormData(prev => ({ ...prev, passwordHash: e.target.value }))}
                  placeholder="Nhập mật khẩu"
                />
                <InputRightElement>
                  <IconButton
                    aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                    icon={<Icon as={showPassword ? FiEyeOff : FiEye} />}
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPassword(!showPassword)}
                  />
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>{errors.passwordHash}</FormErrorMessage>
            </FormControl>

            {/* Phone Number Field */}
            <FormControl isInvalid={!!errors.phoneNumber}>
              <FormLabel>Số điện thoại</FormLabel>
              <Input
                type="tel"
                value={formData.phoneNumber}
                onChange={e => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                placeholder="Nhập số điện thoại"
              />
              <FormErrorMessage>{errors.phoneNumber}</FormErrorMessage>
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={handleClose}>
            Hủy
          </Button>
          <Button
            colorScheme="blue"
            onClick={handleSubmit}
            isLoading={loading}
            loadingText="Đang thêm..."
          >
            Thêm nhân viên
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};