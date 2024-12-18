import { useState, useCallback } from 'react';
import { useToast } from '@chakra-ui/react';
import { Review } from '@/utils/types/feedback.types';
import { reviewApi } from '@/apis/feedback.api';

export const useReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [pagination, setPagination] = useState({
    totalItems: 0,
    pageSize: 10,
    totalPages: 1,
    currentPage: 1
  });
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const fetchReviews = useCallback(async (
    page: number = 1,
    filters: {
      username?: string,
      storeName?: string
    } = {}
  ) => {
    try {
      setLoading(true);
      const response = await reviewApi.getAllReviews(page, filters);
      
      if (response.status === 200) {
        setReviews(response.data.items);
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
        description: 'Không thể tải danh sách đánh giá',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  return {
    data: reviews,
    loading,
    pagination,
    fetchReviews
  };
};
