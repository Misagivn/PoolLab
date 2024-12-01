import { useQuery } from '@tanstack/react-query';
import { courseApi } from '@/apis/course';

export const useCourses = (page: number, search: string) => {
  return useQuery({
    queryKey: ['courses', page, search],
    queryFn: () => courseApi.getAllCourses(page, search)
  });
};