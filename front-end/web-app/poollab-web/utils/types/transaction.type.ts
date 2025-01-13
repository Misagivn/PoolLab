export interface BaseTransaction {
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

export interface Transaction extends BaseTransaction {
  tableIssuesId: string | null;
  subId: string | null;
}

export interface OrderTransaction extends BaseTransaction {
  orderCode: string;
  orderBy: string | null;
}

export interface BaseResponse<T> {
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

export interface TransactionResponse extends BaseResponse<Transaction> {}
export interface OrderTransactionResponse extends BaseResponse<OrderTransaction> {}