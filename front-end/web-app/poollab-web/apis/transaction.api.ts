import { TransactionResponse } from "@/utils/types/transaction.type";

export const transactionApi = {
  getAllTransactions: async (params: {
    pageNumber?: number;
    pageSize?: number;
    username?: string;
  }): Promise<TransactionResponse> => {
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
      `${process.env.NEXT_PUBLIC_LOCAL_URL}/transaction/getalltransaction?${queryParams.toString()}`,
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