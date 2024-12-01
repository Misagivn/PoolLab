import { Course, PaginatedResponse } from "@/utils/types/course";

export const courseApi = {
  getAllCourses: async (page: number = 1, search: string = ''): Promise<PaginatedResponse<Course>> => {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_LOCAL_URL}/course/getallcourses?pageNumber=${page}&search=${search}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const result = await response.json();
    return result.data;
  },

  createCourse: async (courseData: Partial<Course>) => {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_LOCAL_URL}/course/createcourse`,
      {
        method: 'POST',
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(courseData)
      }
    );
    return response.json();
  }
};