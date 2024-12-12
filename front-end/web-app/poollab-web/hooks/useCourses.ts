import { useState, useCallback } from 'react';
import { useToast } from '@chakra-ui/react';
import { Course } from '@/utils/types/course.types';
import { courseApi } from '@/apis/course';

export const useCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    pageSize: 10
  });
  const toast = useToast();

  const fetchCourses = useCallback(async (params: {
    pageNumber?: number;
    title?: string;
    sortBy?: number;
    sortAscending?: boolean;
  } = {}) => {
    try {
      setLoading(true);
      const response = await courseApi.getAllCourses({
        pageSize: pagination.pageSize,
        ...params
      });

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
  }, [pagination.pageSize, toast]);

  const createCourse = async (data: any) => {
    try {
      const response = await courseApi.createCourse(data);
      if (response.status === 200) {
        toast({
          title: 'Thành công',
          description: 'Tạo khóa học mới thành công',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        await fetchCourses({ pageNumber: pagination.currentPage });
        return true;
      }
      throw new Error(response.message || 'Tạo khóa học thất bại');
    } catch (err) {
      toast({
        title: 'Lỗi',
        description: err instanceof Error ? err.message : 'Không thể tạo khóa học mới',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      throw err;
    }
  };

  const updateCourse = async (courseId: string, data: any) => {
    try {
      const response = await courseApi.updateCourse(courseId, data);
      if (response.status === 200) {
        toast({
          title: 'Thành công',
          description: 'Cập nhật khóa học thành công',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        await fetchCourses({ pageNumber: pagination.currentPage });
        return true;
      }
      throw new Error(response.message || 'Cập nhật khóa học thất bại');
    } catch (err) {
      toast({
        title: 'Lỗi',
        description: err instanceof Error ? err.message : 'Không thể cập nhật khóa học',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      throw err;
    }
  };

  const deleteCourse = async (courseId: string) => {
    try {
      const response = await courseApi.deleteCourse(courseId);
      if (response.status === 200) {
        toast({
          title: 'Thành công',
          description: 'Xóa khóa học thành công',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        await fetchCourses({ pageNumber: pagination.currentPage });
        return true;
      }
      throw new Error(response.message || 'Xóa khóa học thất bại');
    } catch (err) {
      toast({
        title: 'Lỗi',
        description: err instanceof Error ? err.message : 'Không thể xóa khóa học',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      throw err;
    }
  };

  const uploadMentorAvatar = async (file: File): Promise<string> => {
    try {
      const response = await courseApi.uploadMentorAvatar(file);
      if (response.status === 200) {
        return response.data as string;
      }
      throw new Error('Upload avatar thất bại');
    } catch (err) {
      toast({
        title: 'Lỗi',
        description: 'Không thể tải ảnh lên',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      throw err;
    }
  };

  return {
    courses,
    loading,
    pagination,
    fetchCourses,
    createCourse,
    updateCourse,
    deleteCourse,
    uploadMentorAvatar
  };
};