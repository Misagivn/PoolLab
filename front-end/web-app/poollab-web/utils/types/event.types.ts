export interface Event {
  id: string;
  title: string; 
  descript: string;
  thumbnail: string;
  managerId: string;
  username: string;
  fullName: string;
  storeId: string | null;
  storeName: string | null;
  address: string | null;
  timeStart: string;
  timeEnd: string;
  createdDate: string;
  updatedDate: string | null;
  status: string;
}

export interface PaginatedResponse {
  items: Event[];
  totalItem: number;
  pageSize: number;
  totalPages: number;
  pageNumber: number;
}

export interface EventResponse {
  status: number;
  message: string | null;
  data: PaginatedResponse;
}