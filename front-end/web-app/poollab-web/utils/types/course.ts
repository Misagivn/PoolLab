export interface Course {
  id: string;
  title: string;
  descript: string;
  price: number;
  schedule: string;
  startDate: string;
  endDate: string | null;
  startTime: string | null;
  endTime: string | null;
  level: string | null;
  quantity: number | null;
  noOfUser: number;
  storeId: string | null;
  storeName: string | null;
  address: string | null;
  accountId: string | null;
  accountName: string | null;
  accountAvatar: string | null;
  mentorId: string | null;
  createdDate: string;
  updatedDate: string | null;
  status: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalItem: number;
  pageSize: number;
  totalPages: number;
  pageNumber: number;
}