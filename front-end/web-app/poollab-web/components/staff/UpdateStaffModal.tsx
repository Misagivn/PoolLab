'use client';

import { useEffect, useState } from 'react';
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
  useToast,
  FormErrorMessage,
  Avatar,
  Box,
} from '@chakra-ui/react';
import { useStaff } from '@/hooks/useStaff';
import { Staff, UpdateStaffRequest } from '@/utils/types/staff.types';

interface UpdateStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  staff: Staff | null;
}

export const UpdateStaffModal = ({ isOpen, onClose, staff }: UpdateStaffModalProps) => {
  const { updateStaff } = useStaff();
  const [formData, setFormData] = useState<UpdateStaffRequest>({
    email: '',
    avatarUrl: '',
    userName: '',
    fullName: '',
    phoneNumber: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (staff && isOpen) {
      setFormData({
        email: staff.email || '',
        avatarUrl: staff.avatarUrl || '',
        userName: staff.userName || '',
        fullName: staff.fullName || '',
        phoneNumber: staff.phoneNumber || '',
      });
      setErrors({});
    }
  }, [staff, isOpen]);

  const handleClose = () => {
    setFormData({
      email: '',
      avatarUrl: '',
      userName: '',
      fullName: '',
      phoneNumber: '',
    });
    setErrors({});
    onClose();
  };

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

    if (formData.phoneNumber && !/^[0-9]{10,11}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Số điện thoại không hợp lệ (phải có 10-11 số)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm() || !staff) return;

    try {
      setLoading(true);
      await updateStaff(staff.id, formData);
      handleClose();
    } catch (error) {
      console.error('Update failed:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!staff) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} closeOnOverlayClick={false} size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Cập nhật thông tin nhân viên</ModalHeader>
        <ModalCloseButton />
        
        <ModalBody>
          <VStack spacing={4}>
            <Box>
              <Avatar
                size="xl"
                src={staff.avatarUrl || undefined}
                name={staff.fullName}
              />
            </Box>

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
            loadingText="Đang cập nhật..."
          >
            Cập nhật
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};