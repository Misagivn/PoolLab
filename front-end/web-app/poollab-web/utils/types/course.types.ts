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
  accountAvatar: string;
  mentorId: string | null;
  createdDate: string;
  updatedDate: string | null;
  status: string;
}

export interface Member {
  id: string;
  email: string;
  avatarUrl: string;
  userName: string;
  fullName: string;
  phoneNumber: string;
  roleId: string;
  roleName: string;
  status: string;
}

export interface CourseApiResponse {
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