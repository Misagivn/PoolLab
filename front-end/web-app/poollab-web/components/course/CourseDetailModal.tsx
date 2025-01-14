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
  Badge,
  HStack,
  Icon,
  Grid,
  Divider,
  Avatar,
} from '@chakra-ui/react';
import { 
  FiMapPin, 
  FiClock, 
  FiCalendar, 
  FiUsers, 
  FiDollarSign,
  FiUser
} from 'react-icons/fi';
import { Course } from '@/utils/types/course.types';
import { formatCurrency, formatDateTime, formatSchedule } from '@/utils/format';

interface CourseDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: Course | null;
}

export const CourseDetailModal = ({
  isOpen,
  onClose,
  course
}: CourseDetailModalProps) => {
  if (!course) return null;

  const statusColorScheme = {
    'Kích Hoạt': 'green',
    'Hủy': 'red',
    'Hoàn Thành': 'blue'
  }[course.status] || 'gray';

  const levelColorScheme = {
    'level 1': 'blue',
    'level 2': 'purple',
    'level 3': 'orange'
  }[course.level] || 'gray';

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader borderBottomWidth="1px">Chi tiết khóa học</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Stack spacing={6}>
            {/* Thông tin cơ bản */}
            <Box>
              <Text fontSize="2xl" fontWeight="bold">
                {course.title}
              </Text>
              <HStack mt={2} spacing={2}>
                <Badge colorScheme={statusColorScheme}>
                  {course.status}
                </Badge>
                <Badge colorScheme={levelColorScheme}>
                  {course.level}
                </Badge>
              </HStack>
            </Box>

            {/* Thông tin chi tiết */}
            <Grid templateColumns="repeat(2, 1fr)" gap={4}>
              <Box>
                <HStack color="gray.600" mb={1}>
                  <Icon as={FiDollarSign} />
                  <Text>Học phí</Text>
                </HStack>
                <Text fontWeight="bold" color="green.500" fontSize="lg">
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

              <Box>
                <HStack color="gray.600" mb={1}>
                  <Icon as={FiCalendar} />
                  <Text>Lịch học</Text>
                </HStack>
                <Text fontWeight="medium">
                  {formatSchedule(course.schedule)}
                </Text>
              </Box>

              <Box>
                <HStack color="gray.600" mb={1}>
                  <Icon as={FiClock} />
                  <Text>Thời gian học</Text>
                </HStack>
                <Text fontWeight="medium">
                  {course.startTime.substring(0, 5)} - {course.endTime.substring(0, 5)}
                </Text>
              </Box>

              <Box>
                <HStack color="gray.600" mb={1}>
                  <Icon as={FiCalendar} />
                  <Text>Thời gian khóa học</Text>
                </HStack>
                <Text fontWeight="medium">
                  {new Date(course.startDate).toLocaleDateString('vi-VN')} -{' '}
                  {new Date(course.endDate).toLocaleDateString('vi-VN')}
                </Text>
              </Box>

              <Box>
                <HStack color="gray.600" mb={1}>
                  <Icon as={FiMapPin} />
                  <Text>Địa điểm</Text>
                </HStack>
                <Text fontWeight="medium">{course.storeName}</Text>
                <Text fontSize="sm" color="gray.600" mt={1}>
                  {course.address}
                </Text>
              </Box>
            </Grid>

            <Divider />

            {/* Thông tin giảng viên */}
            <Box>
              <Text fontWeight="semibold" mb={3}>Thông tin giảng viên:</Text>
              <HStack spacing={3}>
                <Avatar 
                  size="md" 
                  name={course.accountName} 
                  src={course.accountAvatar || undefined}
                />
                <Box>
                  <Text fontWeight="medium">{course.accountName}</Text>
                  <Text fontSize="sm" color="gray.600">Giảng viên chính</Text>
                </Box>
              </HStack>
            </Box>

            {/* Mô tả khóa học */}
            {course.descript && (
              <Box>
                <Text fontWeight="semibold" mb={2}>Mô tả khóa học:</Text>
                <Text whiteSpace="pre-line" color="gray.600">
                  {course.descript}
                </Text>
              </Box>
            )}

            <Divider />

            {/* Thông tin thêm */}
            <Box>
              <Text fontWeight="semibold" mb={2}>Thông tin thêm:</Text>
              <Stack spacing={1}>
                {/* <Text fontSize="sm" color="gray.600">
                  Người tạo: {course.accountName}
                </Text> */}
                <Text fontSize="sm" color="gray.600">
                  Ngày tạo: {formatDateTime(course.createdDate)}
                </Text>
                {course.updatedDate && (
                  <Text fontSize="sm" color="gray.600">
                    Cập nhật lần cuối: {formatDateTime(course.updatedDate)}
                  </Text>
                )}
              </Stack>
            </Box>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};