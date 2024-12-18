import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Stack,
  VStack,
  Text,
  Box,
  HStack,
  Badge,
  Divider,
} from '@chakra-ui/react';
import { Course } from '@/utils/types/course.types';

interface CourseDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: Course | null;
}

export const CourseDetailModal = ({ isOpen, onClose, course }: CourseDetailModalProps) => {
  if (!course) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Chi tiết khóa học</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Stack spacing={4}>
            <Box>
              <Text fontWeight="bold" fontSize="xl">
                {course.title}
              </Text>
              <HStack spacing={2} mt={1}>
                <Badge colorScheme={course.status === 'Kích Hoạt' ? 'green' : 'red'}>
                  {course.status}
                </Badge>
                <Badge colorScheme="blue">{course.level}</Badge>
              </HStack>
            </Box>

            <Divider />

            <VStack align="start" spacing={3}>
              <Box>
                <Text fontWeight="semibold">Thông tin cơ bản:</Text>
                <Text>Giá: {formatPrice(course.price)}</Text>
                <Text>Số lượng học viên: {course.quantity}</Text>
                <Text>Số học viên đã đăng ký: {course.noOfUser}</Text>
              </Box>

              <Box>
                <Text fontWeight="semibold">Thời gian học:</Text>
                <Text>Lịch học: {course.schedule}</Text>
                <Text>Thời gian: {course.startTime?.split('T')[1]} - {course.endTime?.split('T')[1]}</Text>
                <Text>Thời gian học: {new Date(course.startDate).toLocaleDateString('vi-VN')} - {new Date(course.endDate).toLocaleDateString('vi-VN')}</Text>
              </Box>

              <Box>
                <Text fontWeight="semibold">Địa điểm:</Text>
                <Text>Cửa hàng: {course.storeName}</Text>
                <Text>Địa chỉ: {course.address}</Text>
              </Box>

              <Box>
                <Text fontWeight="semibold">Giảng viên:</Text>
                <Text>{course.accountName}</Text>
              </Box>

              <Box width="100%">
                <Text fontWeight="semibold">Mô tả khóa học:</Text>
                <Text whiteSpace="pre-wrap">{course.descript}</Text>
              </Box>

              <Box width="100%">
                <Text fontWeight="semibold">Thông tin thêm:</Text>
                <Text>Ngày tạo: {new Date(course.createdDate).toLocaleDateString('vi-VN')}</Text>
                {course.updatedDate && (
                  <Text>
                    Cập nhật lần cuối: {new Date(course.updatedDate).toLocaleDateString('vi-VN')}
                  </Text>
                )}
              </Box>
            </VStack>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};