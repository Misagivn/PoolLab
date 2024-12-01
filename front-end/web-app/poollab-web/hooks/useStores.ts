import { useQuery } from '@tanstack/react-query';
import { storeApi } from '@/apis/store.api';
import { Store } from '@/utils/types/store';

export const useStores = () => {
  return useQuery({
    queryKey: ['stores'],
    queryFn: async () => {
      const response = await storeApi.getAllStores();
      return response.data as Store[];
    }
  });
};

export const useStore = (storeId: string) => {
  return useQuery({
    queryKey: ['store', storeId],
    queryFn: async () => {
      const response = await storeApi.getStoreById(storeId);
      return response.data as Store;
    },
    enabled: !!storeId
  });
};