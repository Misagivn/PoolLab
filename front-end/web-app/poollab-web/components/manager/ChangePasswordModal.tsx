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
} from '@chakra-ui/react';
import { useState } from 'react';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { oldPassword: string; newPassword: string }) => Promise<void>;
}

export const ChangePasswordModal = ({
  isOpen,
  onClose,
  onSubmit,
}: ChangePasswordModalProps) => {
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (formData.newPassword !== formData.confirmPassword) {
      alert('Mật khẩu mới không khớp!');
      return;
    }
    setIsLoading(true);
    try {
      await onSubmit({
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
      });
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Đổi mật khẩu</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Mật khẩu cũ</FormLabel>
              <Input
                type="password"
                value={formData.oldPassword}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    oldPassword: e.target.value,
                  }))
                }
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Mật khẩu mới</FormLabel>
              <Input
                type="password"
                value={formData.newPassword}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    newPassword: e.target.value,
                  }))
                }
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Xác nhận mật khẩu mới</FormLabel>
              <Input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    confirmPassword: e.target.value,
                  }))
                }
              />
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
            Xác nhận
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};