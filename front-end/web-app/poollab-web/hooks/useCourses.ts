import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@chakra-ui/react';
import { Course } from '@/utils/types/course.types';
import { courseApi } from '@/apis/course';
import { jwtDecode } from 'jwt-decode';

interface JWTPayload {
  storeId: string;
  accountId: string;
  [key: string]: any;
}

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

  const getUserInfo = (): { storeId: string; accountId: string } => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');
    
    const decoded = jwtDecode<JWTPayload>(token);
    return {
      storeId: decoded.storeId,
      accountId: decoded.accountId
    };
  };

  const createCourse = async (data: Omit<Course, 'id' | 'status' | 'createdDate' | 'updatedDate'>) => {
    try {
      const userInfo = getUserInfo();
      const createData = {
        ...data,
        storeId: userInfo.storeId,
        accountId: userInfo.accountId,
      };

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
      const userInfo = getUserInfo();
      const updateData = {
        ...data,
        storeId: userInfo.storeId,
        accountId: userInfo.accountId,
      };

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