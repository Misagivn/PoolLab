import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@chakra-ui/react';
import { Course } from '@/utils/types/course.types';
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

  const createCourse = async (data: Omit<Course, 'courseMonth' | 'id' | 'status' | 'createdDate' | 'updatedDate'>) => {
    try {
    // Tính courseMonth từ startDate và endDate
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);

    const courseMonth =
      (endDate.getFullYear() - startDate.getFullYear()) * 12 +
      (endDate.getMonth() - startDate.getMonth());

      // Chuyển đổi schedule từ array sang string nếu cần
      const createData = {
        ...data,
        courseMonth: `${courseMonth}`,
        schedule: data.schedule
      };

      console.log('Creating course with data:', createData); // Debug log

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
      if (!data.title) {
        throw new Error('Title is required');
      }

      const updateData = {
        title: data.title ?? '', // Đảm bảo title không undefined
        descript: data.descript ?? '', // Cung cấp giá trị mặc định
        price: data.price ?? 0,
        schedule: Array.isArray(data.schedule) ? data.schedule.join(',') : data.schedule ?? '',
        startDate: data.startDate ?? '',
        endDate: data.endDate ?? '',
        startTime: data.startTime ?? '',
        endTime: data.endTime ?? '',
        level: data.level ?? '',
        quantity: data.quantity ?? 0,
        storeId: data.storeId ?? '',
        accountId: data.accountId ?? '',
        status: data.status ?? ''
      };

      // const updateData = {
      //   ...data,
      //   title: data.title != undefined ? data.title : "",
      //   schedule: Array.isArray(data.schedule) ? data.schedule.join(',') : data.schedule
      // };

      console.log('Updating course with data:', updateData); // Debug log

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