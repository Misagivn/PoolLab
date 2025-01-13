import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@chakra-ui/react';
import { Course, CreateCourseDTO } from '@/utils/types/course.types';
import { courseApi } from '@/apis/course';

export const useCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    pageSize: 10
  });
  const toast = useToast();

  const fetchCourses = useCallback(async (page: number = 1) => {
    try {
      setLoading(true);
      const response = await courseApi.getAllCourses(page);
      
      if (response.status === 200) {
        setCourses(response.data.items);
        setPagination({
          currentPage: response.data.pageNumber,
          totalPages: response.data.totalPages,
          totalItems: response.data.totalItem,
          pageSize: response.data.pageSize
        });
      }
    } catch (err) {
      toast({
        title: 'Lỗi',
        description: 'Không thể tải danh sách khóa học',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      setCourses([]);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const createCourse = async (data: CreateCourseDTO) => {
    try {
      const createData = {
        ...data,
        price: Number(data.price) || 0,
        quantity: Number(data.quantity) || 1
      };
  
      console.log('Creating course with data:', createData);
      const response = await courseApi.createCourse(createData);
      
      if (response.status === 200) {
        toast({
          title: 'Thành công',
          description: 'Thêm khóa học mới thành công',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        await fetchCourses();
        return response.data;
      }
    } catch (err) {
      console.error('Error creating course:', err);
      toast({
        title: 'Lỗi',
        description: 'Không thể thêm khóa học mới',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      throw err;
    }
  };

  const updateCourse = async (courseId: string, data: Partial<Course>) => {
    try {
      const updateData = {
        ...data,
        price: Number(data.price) || 0,
        quantity: Number(data.quantity) || 1,
        schedule: Array.isArray(data.schedule) ? data.schedule.join(',') : data.schedule
      };
  
      console.log('Updating course with data:', updateData);
      const response = await courseApi.updateCourse(courseId, updateData);
      
      if (response.status === 200) {
        toast({
          title: 'Thành công',
          description: 'Cập nhật khóa học thành công',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        await fetchCourses(pagination.currentPage);
        return response.data;
      }
    } catch (err) {
      console.error('Error updating course:', err);
      toast({
        title: 'Lỗi',
        description: 'Không thể cập nhật khóa học',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      throw err;
    }
  };
  
  const cancelCourse = async (courseId: string) => {
    try {
      const response = await courseApi.cancelCourse(courseId);
      if (response.status === 200) {
        toast({
          title: 'Thành công',
          description: 'Hủy khóa học thành công',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        await fetchCourses(pagination.currentPage);
      } else {
        throw new Error(response.message || 'Failed to cancel course');
      }
    } catch (err) {
      console.error('Error canceling course:', err);
      toast({
        title: 'Lỗi',
        description: err instanceof Error ? err.message : 'Không thể hủy khóa học',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      throw err;
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  return {
    data: courses,
    loading,
    selectedCourse,
    pagination,
    fetchCourses,
    createCourse,
    updateCourse,
    cancelCourse,
    selectCourse: setSelectedCourse
  };
};