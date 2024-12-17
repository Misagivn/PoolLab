import { useState, useCallback } from 'react';
import { useToast } from '@chakra-ui/react';
import { Event } from '@/utils/types/event.types';
import { eventApi } from '@/apis/event.api';

export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [pagination, setPagination] = useState({
    totalItems: 0,
    pageSize: 10,
    totalPages: 1,
    currentPage: 1
  });
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const fetchEvents = useCallback(async (page: number = 1) => {
    try {
      setLoading(true);
      const response = await eventApi.getAllEvents(page);
      
      if (response.status === 200) {
        setEvents(response.data.items);
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
        description: 'Không thể tải danh sách sự kiện',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const createEvent = async (data: Omit<Event, 'id' | 'username' | 'fullName' | 'storeName' | 'address' | 'createdDate' | 'updatedDate' | 'status'>) => {
    try {
      const response = await eventApi.createEvent(data);
      if (response.status === 200) {
        toast({
          title: 'Thành công',
          description: 'Thêm sự kiện mới thành công',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        await fetchEvents();
        return response.data;
      }
    } catch (err) {
      toast({
        title: 'Lỗi',
        description: 'Không thể thêm sự kiện mới',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      throw err;
    }
  };

  const updateEvent = async (eventId: string, data: Omit<Event, 'id' | 'username' | 'fullName' | 'storeName' | 'address' | 'createdDate' | 'updatedDate' | 'status'>) => {
    try {
      const response = await eventApi.updateEvent(eventId, data);
      if (response.status === 200) {
        toast({
          title: 'Thành công', 
          description: 'Cập nhật sự kiện thành công',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        await fetchEvents();
        return response.data;
      }
    } catch (err) {
      toast({
        title: 'Lỗi',
        description: 'Không thể cập nhật sự kiện',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      throw err;
    }
  };

  const deleteEvent = async (eventId: string) => {
    try {
      const response = await eventApi.deleteEvent(eventId);
      if (response.status === 200) {
        toast({
          title: 'Thành công',
          description: 'Xóa sự kiện thành công',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        await fetchEvents();
      }
    } catch (err) {
      toast({
        title: 'Lỗi',
        description: 'Không thể xóa sự kiện',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      throw err;
    }
  };

  return {
    data: events,
    loading,
    pagination,
    fetchEvents,
    createEvent,
    updateEvent,
    deleteEvent
  };
};