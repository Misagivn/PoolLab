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
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
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
            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
              />
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
            <FormControl>
              <FormLabel>Tên tài khoản</FormLabel>
              <Input
                value={formData.userName}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, userName: e.target.value }))
                }
              />
            </FormControl>
            <FormControl>
              <FormLabel>Số điện thoại</FormLabel>
              <Input
                value={formData.phoneNumber}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, phoneNumber: e.target.value }))
                }
              />
            </FormControl>
            {/* <FormControl>
              <FormLabel>Avatar URL</FormLabel>
              <Input
                value={formData.avatarUrl}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, avatarUrl: e.target.value }))
                }
              />
            </FormControl> */}
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