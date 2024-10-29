'use client';

import { useState, useEffect } from 'react';
import { Select, useToast } from '@chakra-ui/react';
import { Store } from '../../../lib/types';
import { authApi } from '../../../lib/auth';

interface SelectStoreProps {
  value?: string;
  onChange: (value: string) => void;
}

export default function SelectStore({ value, onChange }: SelectStoreProps) {
  const [stores, setStores] = useState<Store[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const fetchStores = async () => {
      try {
        setIsLoading(true);
        const response = await authApi.getAllStores();
        console.log('Store API Response:', response); // For debugging

        // Ensure stores is always an array
        let storeData = [];
        if (Array.isArray(response.data)) {
          storeData = response.data;
        } else if (response.data && typeof response.data === 'object') {
          // If response.data is an object, try to find an array property
          const possibleArrays = ['items', 'data', 'stores', 'results'];
          for (const key of possibleArrays) {
            if (Array.isArray(response.data[key])) {
              storeData = response.data[key];
              break;
            }
          }
        }

        setStores(storeData);

        if (storeData.length === 0) {
          toast({
            title: 'No stores found',
            status: 'warning',
            duration: 3000,
          });
        }
      } catch (error) {
        console.error('Error fetching stores:', error);
        toast({
          title: 'Error loading stores',
          description: 'Failed to load store list',
          status: 'error',
          duration: 3000,
        });
        setStores([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStores();
  }, [toast]);

  if (isLoading) {
    return (
      <Select
        placeholder="Loading stores..."
        isDisabled
      />
    );
  }

  return (
    <Select
      placeholder="Select store"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      isDisabled={isLoading}
    >
      {Array.isArray(stores) && stores.length > 0 ? (
        stores.map((store) => (
          <option key={store.id} value={store.id}>
            {store.name}
          </option>
        ))
      ) : (
        <option value="" disabled>No stores available</option>
      )}
    </Select>
  );
}
