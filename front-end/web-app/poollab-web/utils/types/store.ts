export interface Store {
  id: string;
  name: string;
  address: string;
  storeImg: string;
  descript: string;
  phoneNumber: string;
  rated: number;
  timeStart: string | null;
  timeEnd: string | null;
  companyId: string | null;
  createdDate: string;
  updatedDate: string | null;
  status: string;
}

interface StoreApiResponse {
  status: number;
  message: string | null;
  data: {
    items: Store[];
    totalItem: number;
    pageSize: number;
    totalPages: number;
    pageNumber: number;
  };
}

export interface PaginatedResponse {
  items: Store[];
  totalItem: number;
  pageSize: number;
  totalPages: number;
  pageNumber: number;
}

export interface StoreResponse {
  status: number;
  message: string | null;
  data: PaginatedResponse;
}