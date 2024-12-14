import { useState, useCallback, useEffect } from "react";
import { useToast } from "@chakra-ui/react";
import { Event } from "@/utils/types/event.types";
import {EventApi} from '@/apis/event.api';

export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      const response = await EventApi.getAllEvents();
       if (response.status === 200 && response.data) {
        setEvents(response.data.items);
        setTotalItems(response.data.totalItem);
        return response.data;
       }
    }catch(err) {
      toast ({
        title: 'lỗi',
        description: 'Không thể tải danh sách Sự kiện',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      setEvents([]);
      setTotalItems(0);
    }finally{
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);
  return {
    data: events,
    totalItems,
    loading,
    fetchEvents,
  }
}