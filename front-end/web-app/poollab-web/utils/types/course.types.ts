export interface Course {
  id: string;
  title: string;
  descript: string;
  price: number;
  schedule: string;
  startDate: string;
  endDate: string; 
  startTime: string;
  endTime: string;
  level: string;
  quantity: number;
  noOfUser: number;
  storeId: string;
  storeName: string;
  address: string;
  accountId: string;
  accountName: string;
  accountAvatar: string | null;
  mentorId: string | null;
  createdDate: string;
  updatedDate: string | null;
  status: string;
 }
 
 export interface CreateCourseRequest {
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
 }
 
 export interface UpdateCourseRequest {
  title: string;
  descript: string;
  price: number;
  schedule: string;
  startDate: string;
  endDate?: string;  
  startTime?: string; 
  endTime?: string;  
  level: string;
  quantity: number;
  storeId: string;
  accountId: string;
  status: string;
}
 
 export interface DeleteCourseRequest {
  id: string;  
 }
 
 export interface CourseResponse {
  status: number;
  message: string | null;
  data: Course;
 }
 
 export interface PaginatedCourseResponse {
  status: number;
  message: string | null;
  data: {
    items: Course[];
    totalItem: number;
    pageSize: number;
    totalPages: number;
    pageNumber: number;
  };
 }
 
 export interface CourseFilters {
  pageNumber?: number;
  pageSize?: number; 
  title?: string;
  sortBy?: number;
  sortAscending?: boolean;
 }
 
 export interface UploadAvatarResponse {
  status: number;
  message: string | null;
  data: string;
 }