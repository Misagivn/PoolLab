export interface FeedbackData {
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

export interface FeedbackResponse {
  status: number;
  message: string | null;
  data: {
    items: FeedbackData[];
    totalItem: number;
    pageSize: number;
    totalPages: number;
    pageNumber: number;
  };
}