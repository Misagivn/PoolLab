import { CourseResponse, CreateCourseDTO, PaginatedCourseResponse, UpdateCourseRequest } from '@/utils/types/course.types';

const BASE_URL = 'https://poollabwebapi20241008201316.azurewebsites.net/api';

export const courseApi = {
  getAllCourses: async (page: number = 1, pageSize: number = 10): Promise<PaginatedCourseResponse> => {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${BASE_URL}/course/getallcourses?SortBy=createdDate&SortAscending=false&PageNumber=${page}&PageSize=${pageSize}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.json();
  },

  getCourseById: async (courseId: string): Promise<CourseResponse> => {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${BASE_URL}/course/getcoursebyid/${courseId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.json();
  },

  createCourse: async (data: CreateCourseDTO): Promise<CourseResponse> => {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${BASE_URL}/course/createcourse`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      }
    );
    return response.json();
  },

  updateCourse: async (courseId: string, data: UpdateCourseRequest): Promise<CourseResponse> => {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${BASE_URL}/course/updatecourse/${courseId}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      }
    );
    return response.json();
  },
  
  cancelCourse: async (courseId: string): Promise<CourseResponse> => {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${BASE_URL}/course/cancelcourse/${courseId}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.json();
  }
};