import { useState, useEffect } from 'react';
import { useToast } from '@chakra-ui/react';
import { feedbackApi } from '@/apis/feedback.api';
import { storeApi } from '@/apis/store.api';
import { FeedbackData } from '@/utils/types/feedback.types';
import { Store } from '@/utils/types/store';

export const useFeedback = () => {
  const [feedbacks, setFeedbacks] = useState<FeedbackData[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStore, setSelectedStore] = useState<string>('');
  const [sortAscending, setSortAscending] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const toast = useToast();

  const fetchStores = async () => {
    try {
      const response = await storeApi.getAllStores();
      if (Array.isArray(response.data)) {
        setStores(response.data);
        if (response.data.length > 0) {
          setSelectedStore(response.data[0].id);
        }
      }
    } catch (err) {
      toast({
        title: 'Lỗi',
        description: 'Không thể tải danh sách cửa hàng',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const fetchFeedbacks = async () => {
    if (!selectedStore) return;
    
    setLoading(true);
    try {
      const response = await feedbackApi.getAllFeedback({
        CusName: searchTerm,
        StoreId: selectedStore,
        SortBy: 1,
        SortAscending: sortAscending
      });
      
      if (response.status === 200) {
        setFeedbacks(response.data.items);
      }
    } catch (err) {
      toast({
        title: 'Lỗi',
        description: 'Không thể tải danh sách đánh giá',
        status: 'error',
        duration: 3000,
      });
      setFeedbacks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  useEffect(() => {
    if (selectedStore) {
      fetchFeedbacks();
    }
  }, [selectedStore, searchTerm, sortAscending]);

  return {
    feedbacks,
    stores,
    loading,
    selectedStore,
    searchTerm,
    sortAscending,
    handleSearchChange: setSearchTerm,
    handleStoreChange: setSelectedStore,
    toggleSortDirection: () => setSortAscending(prev => !prev),
  };
};