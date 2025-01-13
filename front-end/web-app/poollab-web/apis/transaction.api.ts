import { TransactionResponse, OrderTransactionResponse } from '@/utils/types/transaction.type';

const BASE_URL = process.env.NEXT_PUBLIC_LOCAL_URL;

interface TransactionParams {
  pageNumber?: number;
  pageSize?: number;
  username?: string;
}

export const transactionApi = {
  getAllTransactions: async (params: TransactionParams): Promise<TransactionResponse> => {
    const { pageNumber = 1, pageSize = 10, username = '' } = params;
    const token = localStorage.getItem('token');

    const queryParams = new URLSearchParams({
      SortBy: 'paymentDate',
      SortAscending: 'false',
      PageNumber: pageNumber.toString(),
      PageSize: pageSize.toString(),
      ...(username && { Username: username })
    });

    const response = await fetch(
      `${BASE_URL}/transaction/getalltransaction?${queryParams.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.json();
  },

  getAllOrderTransactions: async (params: TransactionParams): Promise<OrderTransactionResponse> => {
    const { pageNumber = 1, pageSize = 10, username = '' } = params;
    const token = localStorage.getItem('token');

    const queryParams = new URLSearchParams({
      SortBy: 'paymentDate',
      SortAscending: 'false',
      PageNumber: pageNumber.toString(),
      PageSize: pageSize.toString(),
      ...(username && { Username: username })
    });

    const response = await fetch(
      `${BASE_URL}/transaction/getallordertransaction?${queryParams.toString()}`,
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