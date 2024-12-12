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
  Select,
  Card,
  CardBody,
  SimpleGrid,
  Show,
  Hide,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { 
  FiSearch, 
  FiRefreshCcw,
  FiEdit2,
  FiInfo,
  FiPlus,
  FiCalendar,
  FiClock,
  FiUsers,
  FiDollarSign,
  FiTrash2,
} from 'react-icons/fi';
import { useCourses } from '@/hooks/useCourses';
import { ProductPagination } from '@/components/common/paginations';
import { formatCurrency } from '@/utils/format';
import { Course } from '@/utils/types/course.types';
import { CourseDetailModal } from '@/components/course/CourseDetailModal';
import { CourseFormModal } from '@/components/course/CourseFormModal';

// Card Component cho mobile view
const CourseCard = ({ course, onView }: { course: Course; onView: (course: Course) => void }) => (
  <Card>
    <CardBody>
      <Stack spacing={3}>
        <HStack justify="space-between">
          <Text fontWeight="bold" fontSize="lg">{course.title}</Text>
          <Badge colorScheme={course.status === 'Kích Hoạt' ? 'green' : 'red'}>
            {course.status === 'Kích Hoạt' ? 'Đang hoạt động' : 'Đã kết thúc'}
          </Badge>
        </HStack>

        <Stack spacing={2} fontSize="sm">
          <HStack justify="space-between">
            <Text color="gray.600">Level:</Text>
            <Text fontWeight="medium">{course.level}</Text>
          </HStack>
          
          <HStack justify="space-between">
            <Text color="gray.600">Lịch học:</Text>
            <Text>{course.schedule}</Text>
          </HStack>

          <HStack justify="space-between">
            <Text color="gray.600">Thời gian:</Text>
            <Text>{course.startTime} - {course.endTime}</Text>
          </HStack>

          <HStack justify="space-between">
            <Text color="gray.600">Số lượng học viên:</Text>
            <Text>{course.noOfUser}/{course.quantity}</Text>
          </HStack>

          <HStack justify="space-between">
            <Text color="gray.600">Giá:</Text>
            <Text fontWeight="bold" color="blue.500">
              {formatCurrency(course.price)}
            </Text>
          </HStack>
        </Stack>

        <Flex justify="flex-end">
          <IconButton
            aria-label="View details"
            icon={<Icon as={FiInfo} />}
            size="sm"
            onClick={() => onView(course)}
          />
        </Flex>
      </Stack>
    </CardBody>
  </Card>
);

export default function CoursePage() {
  const { 
    courses,
    loading,
    pagination,
    fetchCourses,
    createCourse,
  } = useCourses();

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('1'); 
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [formMode, setFormMode] = useState<'create' | 'update'>('create');

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

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchCourses({ 
        pageNumber: 1,
        title: searchQuery || undefined,
        sortBy: Number(sortBy),
        sortAscending: false
      });
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery, sortBy, fetchCourses]);

  const handlePageChange = (page: number) => {
    fetchCourses({ 
      pageNumber: page,
      title: searchQuery || undefined,
      sortBy: Number(sortBy),
      sortAscending: false
    });
  };

  const handleCreateCourse = async (data: any) => {
    try {
      await createCourse(data);
      onFormClose();
    } catch (error) {
      console.error('Error creating course:', error);
    }
  };

  if (loading && courses.length === 0) {
    return (
      <Flex h="100%" align="center" justify="center" p={6}>
        <Spinner size="xl" color="blue.500" />
      </Flex>
    );
  }

  const handleOpenCreate = () => {
    setSelectedCourse(null);
    setFormMode('create');
    onFormOpen();
  };

  const handleOpenEdit = (course: Course) => {
    setSelectedCourse(course);
    setFormMode('update');
    onFormOpen();
  };

  const handleCloseForm = () => {
    setSelectedCourse(null);
    setFormMode('create');
    onFormClose();
  };

  return (
    <Box p={{ base: 4, md: 6 }}>
      <Stack spacing={{ base: 4, md: 6 }}>
        {/* Header */}
        <Flex 
          direction={{ base: 'column', sm: 'row' }}
          justify="space-between" 
          align={{ base: 'stretch', sm: 'center' }}
          gap={4}
        >
          <Heading size={{ base: "md", md: "lg" }}>Quản lý khóa học</Heading>
          <Button
            leftIcon={<Icon as={FiPlus} />}
            colorScheme="blue"
            onClick={handleOpenCreate}
            w={{ base: "full", sm: "auto" }}
          >
            Thêm khóa học
          </Button>
        </Flex>

        {/* Search and Filter */}
        <Stack 
          direction={{ base: 'column', md: 'row' }} 
          spacing={4}
        >
          <InputGroup maxW={{ base: "full", md: "320px" }}>
            <InputLeftElement>
              <Icon as={FiSearch} color="gray.400" />
            </InputLeftElement>
            <Input
              placeholder="Tìm kiếm khóa học..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </InputGroup>

          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            maxW={{ base: "full", md: "200px" }}
          >
            <option value="1">Mới nhất</option>
            <option value="2">Giá tăng dần</option>
            <option value="3">Giá giảm dần</option>
          </Select>

          <IconButton
            aria-label="Refresh"
            icon={<Icon as={FiRefreshCcw} />}
            onClick={() => {
              setSearchQuery('');
              setSortBy('1');
              fetchCourses({ pageNumber: 1 });
            }}
            alignSelf={{ base: "flex-end", md: "auto" }}
          />
        </Stack>

        {/* Desktop View */}
        <Hide below="md">
          <Box overflowX="auto">
            <Table variant="simple" bg="white">
              <Thead bg="gray.50">
                <Tr>
                  <Th>KHÓA HỌC</Th>
                  <Th>LỊCH HỌC</Th>
                  <Th>SỐ LƯỢNG</Th>
                  <Th>GIÁ</Th>
                  <Th>TRẠNG THÁI</Th>
                  <Th width="50px"></Th>
                </Tr>
              </Thead>
              <Tbody>
                {courses.map((course) => (
                  <Tr key={course.id}>
                    <Td>
                      <Stack spacing={1}>
                        <Text fontWeight="medium">{course.title}</Text>
                        <Text fontSize="sm" color="gray.600">Level: {course.level}</Text>
                      </Stack>
                    </Td>
                    <Td>
                      <Stack spacing={1} fontSize="sm">
                        <Text>{course.schedule}</Text>
                        <Text color="gray.600">
                          {course.startTime} - {course.endTime}
                        </Text>
                      </Stack>
                    </Td>
                    <Td>
                      <Text>
                        {course.noOfUser}/{course.quantity}
                      </Text>
                    </Td>
                    <Td>
                      <Text fontWeight="medium" color="blue.500">
                        {formatCurrency(course.price)}
                      </Text>
                    </Td>
                    <Td>
                      <Badge 
                        colorScheme={course.status === 'Kích Hoạt' ? 'green' : 'red'}
                      >
                        {course.status === 'Kích Hoạt' ? 'Đang hoạt động' : 'Đã kết thúc'}
                      </Badge>
                    </Td>
                    <Td>
                      <IconButton
                        aria-label="View details"
                        icon={<Icon as={FiInfo} />}
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setSelectedCourse(course);
                          onDetailOpen();
                        }}
                      />
                      <IconButton
                        aria-label="Edit course"
                        icon={<Icon as={FiEdit2} />}
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setSelectedCourse(course);
                          onFormOpen();
                        }}
                      />
                      <IconButton
                        aria-label="Delete course"
                        icon={<Icon as={FiTrash2} />}
                        size="sm"
                        variant="ghost"
                        colorScheme="red"
                        onClick={() => {
                          setDeleteCourse(course);
                          onDeleteOpen();
                        }}
                      />
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        </Hide>

        {/* Mobile View */}
        <Show below="md">
          <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4}>
            {courses.map((course) => (
              <CourseCard 
                key={course.id}
                course={course}
                onView={(course) => {
                  setSelectedCourse(course);
                  onDetailOpen();
                }}
              />
            ))}
          </SimpleGrid>
        </Show>

        {/* Empty State */}
        {courses.length === 0 && (
          <Flex 
            direction="column" 
            align="center" 
            justify="center" 
            py={{ base: 6, md: 10 }}
            px={4}
            bg="gray.50"
            borderRadius="lg"
            textAlign="center"
          >
            <Text color="gray.500" mb={4}>
              Không tìm thấy khóa học nào
            </Text>
            <Button
              size="sm"
              leftIcon={<Icon as={FiRefreshCcw} />}
              onClick={() => {
                setSearchQuery('');
                setSortBy('1');
                fetchCourses({ pageNumber: 1 });
              }}
            >
              Đặt lại bộ lọc
            </Button>
          </Flex>
        )}

        {/* Pagination */}
        {courses.length > 0 && (
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
          onClose={handleCloseForm}
          onSubmit={formMode === 'create' ? handleCreateCourse : handleUpdateCourse}
          initialData={selectedCourse}
          mode={formMode}
        />
      </Stack>
    </Box>
  );
}