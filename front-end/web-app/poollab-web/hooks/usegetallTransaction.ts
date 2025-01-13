import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@chakra-ui/react';
import { Transaction } from '@/utils/types/transaction.type';
import { transactionApi } from '@/apis/transaction.api';

export const useGeneralTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchUsername, setSearchUsername] = useState('');
  const [pagination, setPagination] = useState({
    totalItems: 0,
    pageSize: 10,
    totalPages: 1,
    currentPage: 1
  });
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const fetchTransactions = useCallback(async (page: number = 1, username: string = '') => {
    try {
      setLoading(true);
      const response = await transactionApi.getAllTransactions({
        pageNumber: page,
        pageSize: pagination.pageSize,
        username
      });
      
      if (response.status === 200) {
        setTransactions(response.data.items);
        setPagination({
          totalItems: response.data.totalItem,
          pageSize: response.data.pageSize,
          totalPages: response.data.totalPages,
          currentPage: response.data.pageNumber
        });
      }
    } catch (err) {
      toast({
        title: 'Lỗi',
        description: 'Không thể tải danh sách giao dịch',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  }, [pagination.pageSize, toast]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchTransactions(1, searchUsername);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchUsername, fetchTransactions]);

  return {
    transactions,
    loading,
    pagination,
    searchUsername,
    setSearchUsername,
    fetchTransactions
  };
};