import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  Text,
} from '@chakra-ui/react';
import { Staff as Member } from '@/utils/types/staff.types';

interface StatusUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: Member | null;
  onUpdateStatus: (status: string) => Promise<void>;
  isLoading: boolean;
}

export const StatusUpdateModal = ({
  isOpen,
  onClose,
  member,
  onUpdateStatus,
  isLoading
}: StatusUpdateModalProps) => {
  if (!member) return null;

  const newStatus = member.status === 'Kích Hoạt' ? 'Vô Hiệu' : 'Kích Hoạt';

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Cập nhật trạng thái</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>
            Bạn có chắc chắn muốn {member.status === 'Kích Hoạt' ? 'khóa' : 'mở khóa'} tài khoản của thành viên{' '}
            <strong>{member.fullName}</strong>?
          </Text>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Hủy
          </Button>
          <Button
            colorScheme={member.status === 'Kích Hoạt' ? 'red' : 'green'}
            onClick={() => onUpdateStatus(newStatus)}
            isLoading={isLoading}
          >
            {member.status === 'Kích Hoạt' ? 'Khóa tài khoản' : 'Mở khóa'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};