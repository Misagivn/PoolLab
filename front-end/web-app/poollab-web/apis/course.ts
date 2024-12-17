import { CourseApiResponse } from "@/utils/types/course.types";

const BASE_URL = 'https://poollabwebapi20241008201316.azurewebsites.net/api';

export const courseApi = {
  getAllCourses: async (page: number = 1): Promise<CourseApiResponse> => {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${BASE_URL}/course/getallcourses?SortBy=createdDate&SortAscending=false&PageNumber=${page}&PageSize=10`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.json();
  },

  getCourseById: async (courseId: string): Promise<CourseApiResponse> => {
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

  createCourse: async (data: {
    title: string;
    descript: string;
    price: number;
    schedule: string[];
    courseMonth: string;
    startTime: string;
    endTime: string;
    level: string;
    quantity: number;
    storeId: string;
    accountId: string;
  }): Promise<CourseApiResponse> => {
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

  updateCourse: async (courseId: string, data: {
    title: string;
    descript: string;
    price: number;
    schedule: string;
    startDate: string;
    level: string;
    quantity: number;
    storeId: string;
    accountId: string;
    status: string;
  }): Promise<CourseApiResponse> => {
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

  cancelCourse: async (courseId: string): Promise<CourseApiResponse> => {
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
  },

  deleteCourse: async (courseId: string): Promise<CourseApiResponse> => {
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

  getMembers: async (): Promise<CourseApiResponse> => {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${BASE_URL}/account/getallaccount?RoleName=Member`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.json();
  }
};
