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
import { Course } from '@/utils/types/course.types';

interface CourseStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: Course | null;
  onUpdateStatus: () => Promise<void>;
  isLoading: boolean;
}

export const CourseStatusModal = ({
  isOpen,
  onClose,
  course,
  onUpdateStatus,
  isLoading
}: CourseStatusModalProps) => {
  if (!course) return null;

  const isActive = course.status === 'Kích Hoạt';

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {isActive ? 'Hủy khóa học' : 'Mở lại khóa học'}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>
            Bạn có chắc chắn muốn {isActive ? 'hủy' : 'mở lại'} khóa học{' '}
            <strong>{course.title}</strong>?
          </Text>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Hủy
          </Button>
          <Button
            colorScheme={isActive ? 'red' : 'green'}
            onClick={onUpdateStatus}
            isLoading={isLoading}
          >
            {isActive ? 'Hủy khóa học' : 'Mở lại khóa học'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};