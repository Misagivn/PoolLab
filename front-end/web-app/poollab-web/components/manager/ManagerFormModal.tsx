import { useState, useRef, useEffect } from 'react';
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
  Select,
} from '@chakra-ui/react';
import { FiEye, FiEyeOff, FiCamera, FiUpload } from 'react-icons/fi';
import { ManagerFormData } from '@/utils/types/manager.type';
import { Store } from '@/utils/types/store';
import { staffApi } from '@/apis/staff.api';
import { Manager } from '@/utils/types/staff.types';

interface ManagerFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ManagerFormData) => Promise<void>;
  stores: Store[];
  initialData?: Manager;
  title?: string;
}

const initialFormData: ManagerFormData = {
  email: '',
  userName: '',
  passwordHash: '',
  fullName: '',
  phoneNumber: '',
  avatarUrl: '',
  storeId: '',
};

export const ManagerFormModal = ({ 
  isOpen, 
  onClose,
  onSubmit,
  stores,
  initialData,
  title = 'Thêm quản lý mới'
}: ManagerFormModalProps) => {
  const [formData, setFormData] = useState<ManagerFormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          email: initialData.email,
          userName: initialData.userName,
          fullName: initialData.fullName,
          phoneNumber: initialData.phoneNumber || '',
          storeId: initialData.storeId,
          avatarUrl: initialData.avatarUrl || '',
          passwordHash: '' // Password không được fill khi update
        });
      } else {
        setFormData(initialFormData);
      }
      setErrors({});
      setShowPassword(false);
    }
  }, [isOpen, initialData]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email là bắt buộc';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (!formData.userName) {
      newErrors.userName = 'Tên đăng nhập là bắt buộc';
    } else if (formData.userName.length < 3) {
      newErrors.userName = 'Tên đăng nhập phải có ít nhất 3 ký tự';
    }

    if (!formData.fullName) {
      newErrors.fullName = 'Họ và tên là bắt buộc';
    } else if (formData.fullName.length < 2) {
      newErrors.fullName = 'Họ và tên phải có ít nhất 2 ký tự';
    }

    // Chỉ validate password khi tạo mới
    if (!initialData) {
      if (!formData.passwordHash) {
        newErrors.passwordHash = 'Mật khẩu là bắt buộc';
      } else if (formData.passwordHash.length < 6) {
        newErrors.passwordHash = 'Mật khẩu phải có ít nhất 6 ký tự';
      }
    }

    if (!formData.storeId) {
      newErrors.storeId = 'Vui lòng chọn cửa hàng';
    }

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
      await onSubmit(formData);
      toast({
        title: 'Thành công',
        description: initialData ? 'Cập nhật thành công' : 'Thêm quản lý mới thành công',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onClose();
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error instanceof Error ? error.message : 'Không thể thực hiện thao tác',
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
      const response = await staffApi.uploadAvatar(file);
      
      if (response.status === 200) {
        setFormData(prev => ({ ...prev, avatarUrl: response.data }));
        toast({
          title: 'Thành công',
          description: 'Tải ảnh đại diện lên thành công',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        throw new Error(response.message || 'Upload failed');
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
      onClose={onClose}
      closeOnOverlayClick={false}
      size="md"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        
        <ModalBody>
          <VStack spacing={4}>
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

            <FormControl isRequired isInvalid={!!errors.storeId}>
              <FormLabel>Cửa hàng quản lý</FormLabel>
              <Select
                value={formData.storeId}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  storeId: e.target.value
                }))}
                placeholder="Chọn cửa hàng"
              >
                {stores.map(store => (
                  <option key={store.id} value={store.id}>
                    {store.name}
                  </option>
                ))}
              </Select>
              <FormErrorMessage>{errors.storeId}</FormErrorMessage>
            </FormControl>

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

            <FormControl isRequired isInvalid={!!errors.userName}>
              <FormLabel>Tên đăng nhập</FormLabel>
              <Input
                value={formData.userName}
                onChange={e => setFormData(prev => ({ ...prev, userName: e.target.value }))}
                placeholder="Nhập tên đăng nhập"
              />
              <FormErrorMessage>{errors.userName}</FormErrorMessage>
            </FormControl>

            <FormControl isRequired isInvalid={!!errors.fullName}>
              <FormLabel>Họ và tên</FormLabel>
              <Input
                value={formData.fullName}
                onChange={e => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                placeholder="Nhập họ và tên"
              />
              <FormErrorMessage>{errors.fullName}</FormErrorMessage>
            </FormControl>

            {/* Chỉ hiển thị password field khi tạo mới */}
            {!initialData && (
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
            )}

            <FormControl isInvalid={!!errors.phoneNumber}>
              <FormLabel>Số điện thoại</FormLabel>
              <Input
                type="tel"
                value={formData.phoneNumber}
                onChange={e => {
                  const value = e.target.value.replace(/[^\d]/g, '');
                  setFormData(prev => ({ ...prev, phoneNumber: value }));
                }}
                maxLength={11}
                placeholder="Nhập số điện thoại"
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
            isLoading={loading}
            loadingText={initialData ? "Đang cập nhật..." : "Đang thêm..."}
          >
            {initialData ? 'Cập nhật' : 'Thêm quản lý'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};