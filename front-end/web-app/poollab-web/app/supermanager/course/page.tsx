'use client';

import {
  Box,
  Flex,
  Text,
  Heading,
  Spinner,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  HStack,
  IconButton,
  Button,
  Icon,
  useDisclosure,
  Badge,
  VStack,
} from '@chakra-ui/react';
import { useState } from 'react';
import { 
  FiSearch, 
  FiRefreshCcw,
  FiEdit2,
  FiInfo,
  FiPlus,
  FiMapPin,
  FiCalendar,
  FiClock,
  FiUsers,
  FiLock,
  FiUnlock
} from 'react-icons/fi';
import { useCourses } from '@/hooks/useCourses';
import { CourseDetailModal } from '@/components/course/CourseDetailModal';
import { CourseFormModal } from '@/components/course/CourseFormModal';
import { CourseStatusModal } from '@/components/course/CourseStatusModal';
import { ProductPagination } from '@/components/common/paginations';
import { formatCurrency, formatSchedule } from '@/utils/format';
import { Course } from '@/utils/types/course.types';

export default function CoursePage() {
  const { 
    data: courses, 
    loading,
    pagination,
    selectedCourse,
    fetchCourses,
    createCourse,
    updateCourse,
    cancelCourse,
    selectCourse
  } = useCourses();
  
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const { 
    isOpen: isDetailOpen, 
    onOpen: onDetailOpen, 
    onClose: onDetailClose 
  } = useDisclosure();
  
  const { 
    isOpen: isFormOpen, 
    onOpen: onFormOpen, 
    onClose: onFormClose 
  } = useDisclosure();

  const { 
    isOpen: isStatusOpen, 
    onOpen: onStatusOpen, 
    onClose: onStatusClose 
  } = useDisclosure();

  const handlePageChange = (page: number) => {
    fetchCourses(page);
  };

  const handleAddCourse = async (data: Partial<Course>) => {
    try {
      await createCourse(data);
      onFormClose();
    } catch (error) {
      console.error('Error adding course:', error);
    }
  };

  const handleUpdateCourse = async (data: Partial<Course>) => {
    if (!selectedCourse) return;
    try {
      await updateCourse(selectedCourse.id, data);
      onFormClose();
      selectCourse(null);
    } catch (error) {
      console.error('Error updating course:', error);
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedCourse) return;
    try {
      if (selectedCourse.status === 'Kích Hoạt') {
        await cancelCourse(selectedCourse.id);
      } else {
        await updateCourse(selectedCourse.id, { ...selectedCourse, status: 'Kích Hoạt' });
      }
      onStatusClose();
      selectCourse(null);
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const filteredCourses = (courses || []).filter(course => 
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.storeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.level.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading && courses.length === 0) {
    return (
      <Flex h="100vh" align="center" justify="center">
        <Spinner size="xl" color="blue.500" />
      </Flex>
    );
  }

  return (
    <Box p={4}>
      <Stack spacing={4}>
        <Flex justify="space-between" align="center">
          <Heading size="lg">Quản lý khóa học</Heading>
          <Button
            leftIcon={<Icon as={FiPlus} />}
            colorScheme="blue"
            onClick={onFormOpen}
          >
            Thêm khóa học
          </Button>
        </Flex>

        <HStack spacing={4}>
          <InputGroup maxW="320px">
            <InputLeftElement>
              <Icon as={FiSearch} color="gray.400" />
            </InputLeftElement>
            <Input
              placeholder="Tìm kiếm khóa học..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </InputGroup>

          <IconButton
            aria-label="Refresh"
            icon={<Icon as={FiRefreshCcw} />}
            onClick={() => {
              setSearchQuery('');
              fetchCourses(1);
            }}
          />
        </HStack>

        <Table variant="simple">
          <Thead bg="gray.50">
            <Tr>
              <Th>KHÓA HỌC</Th>
              <Th>THỜI GIAN</Th>
              <Th>SỐ LƯỢNG</Th>
              <Th isNumeric>HỌC PHÍ</Th>
              <Th>TRẠNG THÁI</Th>
              <Th width="100px" textAlign="right">THAO TÁC</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredCourses.map((course) => (
              <Tr key={course.id}>
                <Td>
                  <Box>
                    <Text fontWeight="medium">{course.title}</Text>
                    <VStack align="start" spacing={1} mt={1}>
                      <HStack color="gray.600" fontSize="sm">
                        <Icon as={FiMapPin} />
                        <Text fontWeight="medium">{course.storeName}</Text>
                      </HStack>
                      {course.address && (
                        <Text color="gray.500" fontSize="sm" pl={6}>
                          {course.address}
                        </Text>
                      )}
                    </VStack>
                    <Badge colorScheme="blue" mt={1}>
                      {course.level}
                    </Badge>
                  </Box>
                </Td>
                <Td>
                  <VStack align="start" spacing={1}>
                    <HStack fontSize="sm">
                      <Icon as={FiCalendar} />
                      <Text>{formatSchedule(course.schedule)}</Text>
                    </HStack>
                    <HStack fontSize="sm">
                      <Icon as={FiClock} />
                      <Text>
                        {course.startTime.substring(0, 5)} - {course.endTime.substring(0, 5)}
                      </Text>
                    </HStack>
                  </VStack>
                </Td>
                <Td>
                  <HStack>
                    <Icon as={FiUsers} />
                    <Text>{course.noOfUser}/{course.quantity}</Text>
                  </HStack>
                </Td>
                <Td isNumeric>
                  <Text color="green.500" fontWeight="medium">
                    {formatCurrency(course.price)}
                  </Text>
                </Td>
                <Td>
                  <Badge
                    colorScheme={course.status === 'Kích Hoạt' ? 'green' : 'red'}
                  >
                    {course.status}
                  </Badge>
                </Td>
                <Td>
                  <HStack spacing={2} justify="flex-end">
                    <IconButton
                      aria-label="View details"
                      icon={<Icon as={FiInfo} />}
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        selectCourse(course);
                        onDetailOpen();
                      }}
                    />
                    <IconButton
                      aria-label="Edit course"
                      icon={<Icon as={FiEdit2} />}
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        selectCourse(course);
                        onFormOpen();
                      }}
                    />
                    <IconButton
                      aria-label="Update status"
                      icon={<Icon as={course.status === 'Kích Hoạt' ? FiLock : FiUnlock} />}
                      size="sm"
                      variant="ghost"
                      colorScheme={course.status === 'Kích Hoạt' ? 'red' : 'green'}
                      onClick={() => {
                        selectCourse(course);
                        onStatusOpen();
                      }}
                    />
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>

        {filteredCourses.length === 0 && (
          <Flex 
            direction="column" 
            align="center" 
            justify="center" 
            py={10}
            bg="gray.50"
            borderRadius="lg"
          >
            <Text color="gray.500">
              Không tìm thấy khóa học nào
            </Text>
          </Flex>
        )}

        {filteredCourses.length > 0 && (
          <ProductPagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
            loading={loading}
          />
        )}

        {/* Modals */}
        <CourseDetailModal
          isOpen={isDetailOpen}
          onClose={onDetailClose}
          course={selectedCourse}
        />

        <CourseFormModal
          isOpen={isFormOpen}
          onClose={() => {
            onFormClose();
            selectCourse(null);
          }}
          onSubmit={selectedCourse ? handleUpdateCourse : handleAddCourse}
          initialData={selectedCourse}
          title={selectedCourse ? 'Chỉnh sửa khóa học' : 'Thêm khóa học mới'}
        />

        <CourseStatusModal
          isOpen={isStatusOpen}
          onClose={onStatusClose}
          course={selectedCourse}
          onUpdateStatus={handleUpdateStatus}
          isLoading={loading}
        />
      </Stack>
    </Box>
  );
}