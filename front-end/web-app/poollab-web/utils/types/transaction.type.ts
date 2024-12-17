export interface Transaction {
  id: string;
  orderId: string;
  accountId: string;
  username: string;
  subId: string | null;
  paymentDate: string;
  amount: number;
  paymentMethod: string;
  paymentInfo: string;
  paymentCode: string | null;
  typeCode: number;
  message: string | null;
  status: string;
}

export interface TransactionResponse {
  status: number;
  message: string | null;
  data: {
    items: Transaction[];
    totalItem: number;
    pageSize: number;
    totalPages: number;
    pageNumber: number;
  };
}