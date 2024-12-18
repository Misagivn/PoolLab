export interface Review {
  id: string;
  message: string;
  storeId: string;
  storeName: string;
  address: string;
  customerId: string;
  cusName: string;
  rated: number;
  createdDate: string;
}

export interface ReviewResponse {
  status: number;
  message: string | null;
  data: {
    items: Review[];
    totalItem: number;
    pageSize: number;
    totalPages: number;
    pageNumber: number;
  };
}