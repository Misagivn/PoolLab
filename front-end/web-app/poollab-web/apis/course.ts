import { 
  CreateCourseRequest, 
  UpdateCourseRequest,
  CourseResponse, 
  PaginatedCourseResponse,
  CourseFilters,
  UploadAvatarResponse 
 } from '@/utils/types/course.types';
 
 const BASE_URL = 'https://poollabwebapi20241008201316.azurewebsites.net/api';
 
 export const courseApi = {
  getAllCourses: async (params: CourseFilters): Promise<PaginatedCourseResponse> => {
    const token = localStorage.getItem('token');
    const url = new URL(`${BASE_URL}/course/getallcourses`);
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.append(key, value.toString());
      }
    });
 
    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.json();
  },
 
  getCourseById: async (id: string): Promise<CourseResponse> => {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${BASE_URL}/course/getcoursebyid/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.json();
  },
 
  createCourse: async (data: CreateCourseRequest): Promise<CourseResponse> => {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${BASE_URL}/course/createcourse`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...data,
          schedule: data.schedule.join(',')
        })
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
 
  deleteCourse: async (courseId: string): Promise<CourseResponse> => {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${BASE_URL}/course/deletecourse?id=${courseId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.json();
  },
 
  uploadMentorAvatar: async (file: File): Promise<UploadAvatarResponse> => {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(
      `${BASE_URL}/account/uploadfileavatar`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData
      }
    );
    return response.json();
  }
 };