import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Stack,
  HStack,
  Box,
  Text,
  Badge,
  Grid,
  Icon,
  Divider,
} from '@chakra-ui/react';
import { 
  FiCalendar, 
  FiClock, 
  FiDollarSign, 
  FiMapPin,
  FiUser,
  FiUsers,
} from 'react-icons/fi';
import { Course } from '@/utils/types/course.types';
import { formatCurrency } from '@/utils/format';

interface CourseDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: Course | null;
}

export const CourseDetailModal = ({ isOpen, onClose, course }: CourseDetailModalProps) => {
  if (!course) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
      <ModalOverlay />
      <ModalContent mx={4}>
        <ModalHeader>Chi tiết khóa học</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Stack spacing={6}>
            {/* Course Title & Status */}
            <Stack>
              <Text fontSize="2xl" fontWeight="bold">{course.title}</Text>
              <HStack>
                <Badge 
                  colorScheme={course.status === 'Kích Hoạt' ? 'green' : 'red'}
                  fontSize="sm"
                >
                  {course.status === 'Kích Hoạt' ? 'Đang hoạt động' : 'Đã kết thúc'}
                </Badge>
                <Badge colorScheme="blue">{course.level}</Badge>
              </HStack>
            </Stack>

            <Divider />

            {/* Course Info */}
            <Grid templateColumns="repeat(2, 1fr)" gap={4}>
              <Box>
                <HStack color="gray.600" mb={1}>
                  <Icon as={FiMapPin} />
                  <Text>Cơ sở</Text>
                </HStack>
                <Text fontWeight="medium">{course.storeName}</Text>
                <Text fontSize="sm" color="gray.600">{course.address}</Text>
              </Box>

              <Box>
                <HStack color="gray.600" mb={1}>
                  <Icon as={FiUser} />
                  <Text>Giảng viên</Text>
                </HStack>
                <Text fontWeight="medium">{course.accountName}</Text>
              </Box>

              <Box>
                <HStack color="gray.600" mb={1}>
                  <Icon as={FiDollarSign} />
                  <Text>Học phí</Text>
                </HStack>
                <Text fontWeight="medium" color="blue.500">
                  {formatCurrency(course.price)}
                </Text>
              </Box>

              <Box>
                <HStack color="gray.600" mb={1}>
                  <Icon as={FiUsers} />
                  <Text>Số lượng học viên</Text>
                </HStack>
                <Text fontWeight="medium">
                  {course.noOfUser}/{course.quantity} học viên
                </Text>
              </Box>
            </Grid>

            <Divider />

            {/* Schedule Info */}
            <Stack spacing={4}>
              <Text fontWeight="semibold">Lịch học</Text>
              
              <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                <Box>
                  <HStack color="gray.600" mb={1}>
                    <Icon as={FiCalendar} />
                    <Text>Thời gian</Text>
                  </HStack>
                  <Text>{course.schedule}</Text>
                </Box>

                <Box>
                  <HStack color="gray.600" mb={1}>
                    <Icon as={FiClock} />
                    <Text>Giờ học</Text>
                  </HStack>
                  <Text>{course.startTime} - {course.endTime}</Text>
                </Box>

                <Box>
                  <Text color="gray.600" mb={1}>Ngày bắt đầu</Text>
                  <Text>{new Date(course.startDate).toLocaleDateString('vi-VN')}</Text>
                </Box>

                <Box>
                  <Text color="gray.600" mb={1}>Ngày kết thúc</Text>
                  <Text>{new Date(course.endDate).toLocaleDateString('vi-VN')}</Text>
                </Box>
              </Grid>
            </Stack>

            {course.descript && (
              <>
                <Divider />
                <Stack spacing={2}>
                  <Text fontWeight="semibold">Mô tả khóa học</Text>
                  <Text>{course.descript}</Text>
                </Stack>
              </>
            )}
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
