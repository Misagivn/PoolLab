import { useState, useCallback } from 'react';
import { useToast } from '@chakra-ui/react';
import { Course, Member } from '@/utils/types/course.types';
import { courseApi } from '@/apis/course';

export const useCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [pagination, setPagination] = useState({
    totalItems: 0,
    pageSize: 10,
    totalPages: 1,
    currentPage: 1
  });
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const fetchCourses = useCallback(async (page: number = 1) => {
    try {
      setLoading(true);
      const response = await courseApi.getAllCourses(page);
      
      if (response.status === 200) {
        setCourses(response.data.items);
        setPagination({
          totalItems: response.data.totalItem,
          pageSize: response.data.pageSize,
          totalPages: response.data.totalPages,
          currentPage: response.data.pageNumber
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

  const fetchMembers = useCallback(async () => {
    try {
      const response = await courseApi.getMembers();
      if (response.status === 200) {
        setMembers(response.data.items);
      }
    } catch (err) {
      toast({
        title: 'Lỗi',
        description: 'Không thể tải danh sách thành viên',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  }, [toast]);

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
        await fetchCourses();
      }
    } catch (err) {
      toast({
        title: 'Lỗi',
        description: 'Không thể tạo khóa học mới',
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
        await fetchCourses();
      }
    } catch (err) {
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
        await fetchCourses();
      }
    } catch (err) {
      toast({
        title: 'Lỗi',
        description: 'Không thể hủy khóa học',
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
        await fetchCourses();
      }
    } catch (err) {
      toast({
        title: 'Lỗi',
        description: 'Không thể xóa khóa học',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      throw err;
    }
  };

  return {
    data: courses,
    members,
    loading,
    pagination,
    fetchCourses,
    fetchMembers,
    createCourse,
    updateCourse,
    cancelCourse,
    deleteCourse
  };
};