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
  Avatar,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Select,
  VStack,
} from '@chakra-ui/react';
import { useState, useEffect, useRef } from 'react';
import { 
  FiSearch, 
  FiRefreshCcw,
  FiEdit2,
  FiInfo,
  FiPlus,
  FiMapPin,
  FiCalendar,
  FiTrash2,
  FiBan,
} from 'react-icons/fi';
import { useCourses } from '@/hooks/useCourses';
import { CourseDetailModal } from '@/components/course/CourseDetailModal';
import { CourseFormModal } from '@/components/course/CourseFormModal';
import { Course } from '@/utils/types/course.types';
import { ProductPagination } from '@/components/common/paginations';

export default function CoursePage() {
  const { 
    data: courses, 
    members,
    loading,
    pagination,
    fetchCourses, 
    fetchMembers,
    createCourse,
    updateCourse,
    cancelCourse,
    deleteCourse,
  } = useCourses();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');
  const cancelRef = useRef(null);
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);
  const [courseToCancel, setCourseToCancel] = useState<Course | null>(null);
  
  const { 
    isOpen: isDeleteOpen, 
    onOpen: onDeleteOpen, 
    onClose: onDeleteClose 
  } = useDisclosure();

  const { 
    isOpen: isCancelOpen, 
    onOpen: onCancelOpen, 
    onClose: onCancelClose 
  } = useDisclosure();

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

  useEffect(() => {
    fetchCourses(1);
    fetchMembers();
  }, [fetchCourses, fetchMembers]);

  const handlePageChange = (page: number) => {
    fetchCourses(page);
  };

  const handleAddCourse = async (data: any) => {
    try {
      await createCourse(data);
      onFormClose();
    } catch (error) {
      console.error('Error adding course:', error);
    }
  };

  const handleUpdateCourse = async (data: any) => {
    if (!selectedCourse) return;
    try {
      await updateCourse(selectedCourse.id, {
        ...data,
        status: selectedCourse.status
      });
      onFormClose();
      setSelectedCourse(null);
    } catch (error) {
      console.error('Error updating course:', error);
    }
  };

  const handleCancelCourse = async () => {
    if (!courseToCancel) return;
    try {
      await cancelCourse(courseToCancel.id);
      onCancelClose();
      setCourseToCancel(null);
    } catch (error) {
      console.error('Error canceling course:', error);
    }
  };

  const handleDeleteCourse = async () => {
    if (!courseToDelete) return;
    try {
      await deleteCourse(courseToDelete.id);
      onDeleteClose();
      setCourseToDelete(null);
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = 
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.accountName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.storeName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || course.status === statusFilter;
    const matchesLevel = levelFilter === 'all' || course.level === levelFilter;

    return matchesSearch && matchesStatus && matchesLevel;
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  if (loading) {
    return (
      <Flex h="100%" align="center" justify="center" p={6}>
        <Spinner size="xl" color="blue.500" />
      </Flex>
    );
  }

  return (
    <Box p={{ base: 4, md: 6 }}>
      <Stack spacing={6}>
        {/* Header */}
        <Flex direction={{ base: 'column', sm: 'row' }} justify="space-between" align={{ base: 'stretch', sm: 'center' }} gap={4}>
          <Heading size={{ base: "md", md: "lg" }}>Quản lý khóa học</Heading>
          <Button
            leftIcon={<Icon as={FiPlus} />}
            colorScheme="blue"
            onClick={onFormOpen}
            w={{ base: "full", sm: "auto" }}
          >
            Thêm khóa học
          </Button>
        </Flex>

        {/* Search and Filters */}
        <Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
          <InputGroup maxW={{ base: "100%", md: "320px" }}>
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
            maxW={{ base: "100%", md: "200px" }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="Kích Hoạt">Đang hoạt động</option>
            <option value="Vô Hiệu">Đã hủy</option>
          </Select>

          <Select
            maxW={{ base: "100%", md: "200px" }}
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
          >
            <option value="all">Tất cả cấp độ</option>
            <option value="level 1">Cơ bản</option>
            <option value="level 2">Trung cấp</option>
            <option value="level 3">Nâng cao</option>
          </Select>

          <IconButton
            aria-label="Refresh"
            icon={<Icon as={FiRefreshCcw} />}
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('all');
              setLevelFilter('all');
              fetchCourses(1);
            }}
          />
        </Stack>

        {/* Courses Table */}
        <Table variant="simple" bg="white" boxShadow="sm" rounded="lg">
          <Thead bg="gray.50">
            <Tr>
              <Th>KHÓA HỌC</Th>
              <Th>THÔNG TIN</Th>
              <Th>LỊCH HỌC</Th>
              <Th>TRẠNG THÁI</Th>
              <Th width="100px" textAlign="right">THAO TÁC</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredCourses.map((course) => (
              <Tr key={course.id}>
                <Td>
                  <VStack align="start" spacing={1}>
                    <Text fontWeight="medium">{course.title}</Text>
                    <HStack spacing={2}>
                      <Badge colorScheme="blue">{course.level}</Badge>
                      <Text fontSize="sm" color="gray.600">
                        {formatPrice(course.price)}
                      </Text>
                    </HStack>
                  </VStack>
                </Td>
                <Td>
                  <VStack align="start" spacing={1}>
                    <HStack>
                      <Avatar 
                        size="sm" 
                        name={course.accountName} 
                        src={course.accountAvatar} 
                      />
                      <Text>{course.accountName}</Text>
                    </HStack>
                    <HStack color="gray.600" fontSize="sm">
                      <Icon as={FiMapPin} />
                      <Text>{course.storeName}</Text>
                    </HStack>
                  </VStack>
                </Td>
                <Td>
                  <VStack align="start" spacing={1}>
                    <Text fontSize="sm">{course.schedule}</Text>
                    <HStack color="gray.600" fontSize="sm">
                      <Icon as={FiCalendar} />
                      <Text>
                        {course.startTime?.split('T')[1]} - {course.endTime?.split('T')[1]}
                      </Text>
                    </HStack>
                  </VStack>
                </Td>
                <Td>
                  <VStack align="start" spacing={1}>
                    <Badge 
                      colorScheme={course.status === 'Kích Hoạt' ? 'green' : 'red'}
                    >
                      {course.status}
                    </Badge>
                    <Text fontSize="sm">
                      {course.noOfUser}/{course.quantity} học viên
                    </Text>
                  </VStack>
                </Td>
                <Td>
                  <HStack spacing={2} justify="flex-end">
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
                    {course.status === 'Kích Hoạt' && (
                      <>
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
                          aria-label="Cancel course"
                          icon={<Icon as={FiBan} />}
                          size="sm"
                          variant="ghost"
                          colorScheme="orange"
                          onClick={() => {
                            setCourseToCancel(course);
                            onCancelOpen();
                          }}
                        />
                      </>
                    )}
                    <IconButton
                      aria-label="Delete course"
                      icon={<Icon as={FiTrash2} />}
                      size="sm"
                      variant="ghost"
                      colorScheme="red"
                      onClick={() => {
                        setCourseToDelete(course);
                        onDeleteOpen();
                      }}
                    />
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>

        {/* Pagination */}
        {!searchQuery && statusFilter === 'all' && levelFilter === 'all' && filteredCourses.length > 0 && (
          <ProductPagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
            loading={loading}
          />
        )}

        {/* Empty State */}
        {filteredCourses.length === 0 && (
          <Flex 
            direction="column" 
            align="center" 
            justify="center" 
            py={10}
            bg="gray.50"
            borderRadius="lg"
          >
            <Icon as={FiCalendar} fontSize="3xl" color="gray.400" mb={2} />
            <Text color="gray.500">
              Không tìm thấy khóa học nào
            </Text>
            <Button
              mt={4}
              size="sm"
              leftIcon={<Icon as={FiRefreshCcw} />}
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
                setLevelFilter('all');
                fetchCourses(1);
              }}
            >
              Đặt lại bộ lọc
            </Button>
          </Flex>
        )}

        {/* Delete Confirmation Dialog */}
        <AlertDialog
          isOpen={isDeleteOpen}
          leastDestructiveRef={cancelRef}
          onClose={onDeleteClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Xóa khóa học
              </AlertDialogHeader>

              <AlertDialogBody>
                Bạn có chắc chắn muốn xóa khóa học "{courseToDelete?.title}"? 
                Hành động này không thể hoàn tác.
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onDeleteClose}>
                  Hủy
                </Button>
                <Button colorScheme="red" onClick={handleDeleteCourse} ml={3}>
                  Xóa
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>

        {/* Cancel Course Dialog */}
        <AlertDialog
          isOpen={isCancelOpen}
          leastDestructiveRef={cancelRef}
          onClose={onCancelClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Hủy khóa học
              </AlertDialogHeader>

              <AlertDialogBody>
                Bạn có chắc chắn muốn hủy khóa học "{courseToCancel?.title}"?
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onCancelClose}>
                Không
                </Button>
                <Button colorScheme="orange" onClick={handleCancelCourse} ml={3}>
                  Hủy khóa học
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>

        {/* Course Detail Modal */}
        <CourseDetailModal
          isOpen={isDetailOpen}
          onClose={onDetailClose}
          course={selectedCourse}
        />

        {/* Course Form Modal */}
        <CourseFormModal
          isOpen={isFormOpen}
          onClose={() => {
            onFormClose();
            setSelectedCourse(null);
          }}
          onSubmit={selectedCourse ? handleUpdateCourse : handleAddCourse}
          initialData={selectedCourse}
          title={selectedCourse ? 'Chỉnh sửa khóa học' : 'Thêm khóa học mới'}
          members={members}
          selectedStore={{
            id: selectedCourse?.storeId || localStorage.getItem('storeId') || '',
            name: selectedCourse?.storeName || localStorage.getItem('storeName') || ''
          }}
        />
      </Stack>
    </Box>
  );
}
