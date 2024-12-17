'use client';

import {
  Box,
  Flex,
  Text,
  Heading,
  Spinner,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  HStack,
  IconButton,
  Button,
  Icon,
  useDisclosure,
  Badge,
  Image,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from '@chakra-ui/react';
import { useState, useEffect, useRef } from 'react';
import { 
  FiSearch, 
  FiRefreshCcw,
  FiEdit2,
  FiInfo,
  FiPlus,
  FiCalendar,
  FiTrash2,
  FiClock,
} from 'react-icons/fi';
import { useEvents } from '@/hooks/useEvent';
import { EventDetailModal } from '@/components/event/EventDetailModel';
import { EventFormModal } from '@/components/event/EventFormModal';
import { Event } from '@/utils/types/event.types';
import { ProductPagination } from '@/components/common/paginations';

export default function EventPage() {
  const { 
    data: events, 
    loading,
    pagination,
    fetchEvents, 
    createEvent,
    updateEvent,
    deleteEvent,
  } = useEvents();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const cancelRef = useRef(null);
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null);

  const { 
    isOpen: isDeleteOpen, 
    onOpen: onDeleteOpen, 
    onClose: onDeleteClose 
  } = useDisclosure();

  const { 
    isOpen: isDetailOpen, 
    onOpen: onDetailOpen, 
    onClose: onDetailClose 
  } = useDisclosure();
  
  const { 
    isOpen: isFormOpen, 
    onOpen: onFormOpen, 
    onClose: onFormClose 
  } = useDisclosure();

  useEffect(() => {
    fetchEvents(1);
  }, [fetchEvents]);

  const handlePageChange = (page: number) => {
    fetchEvents(page);
  };

  

  const handleAddEvent = async (data: Partial<Event>) => {
    try {
      await createEvent(data as any);
      onFormClose();
    } catch (error) {
      console.error('Error adding event:', error);
    }
  };

  const handleUpdateEvent = async (data: Partial<Event>) => {
    if (!selectedEvent) return;
    try {
      await updateEvent(selectedEvent.id, data as any);
      onFormClose();
      setSelectedEvent(null);
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  

  const handleDeleteEvent = async () => {
    if (!eventToDelete) return;
    try {
      await deleteEvent(eventToDelete.id);
      onDeleteClose();
      setEventToDelete(null);
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const filteredEvents = (events || []).filter(event => 
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.descript.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <Flex h="100%" align="center" justify="center" p={6}>
        <Spinner size="xl" color="blue.500" />
      </Flex>
    );
  }

  return (
    <Box p={{ base: 4, md: 6 }}>
      <Stack spacing={6}>
        {/* Header */}
        <Flex direction={{ base: 'column', sm: 'row' }} justify="space-between" align={{ base: 'stretch', sm: 'center' }} gap={4}>
          <Heading size={{ base: "md", md: "lg" }}>Quản lý sự kiện</Heading>
          <Button
            leftIcon={<Icon as={FiPlus} />}
            colorScheme="blue"
            onClick={onFormOpen}
            w={{ base: "full", sm: "auto" }}
          >
            Thêm sự kiện
          </Button>
        </Flex>

        {/* Search and Refresh */}
        <HStack spacing={4}>
          <InputGroup maxW="320px">
            <InputLeftElement>
              <Icon as={FiSearch} color="gray.400" />
            </InputLeftElement>
            <Input
              placeholder="Tìm kiếm sự kiện..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </InputGroup>

          <IconButton
            aria-label="Refresh"
            icon={<Icon as={FiRefreshCcw} />}
            onClick={() => {
              setSearchQuery('');
              fetchEvents(1);
            }}
          />
        </HStack>

        {/* Events Table */}
        <Table variant="simple" bg="white" boxShadow="sm" rounded="lg">
          <Thead bg="gray.50">
            <Tr>
              <Th>SỰ KIỆN</Th>
              <Th>NGƯỜI TẠO</Th>
              <Th>THỜI GIAN</Th>
              <Th>TRẠNG THÁI</Th>
              <Th width="100px" textAlign="right">THAO TÁC</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredEvents.map((event) => (
              <Tr key={event.id}>
                <Td>
                  <HStack spacing={3}>
                    <Image 
                      borderRadius="md"
                      boxSize="50px"
                      objectFit="cover"
                      src={event.thumbnail || 'https://via.placeholder.com/50'}
                      alt={event.title}
                      fallbackSrc="https://via.placeholder.com/50"
                    />
                    <Box>
                      <Text fontWeight="medium">{event.title}</Text>
                      <Text color="gray.600" fontSize="sm" noOfLines={2}>
                        {event.descript}
                      </Text>
                    </Box>
                  </HStack>
                </Td>
                <Td>
                  <Text>{event.fullName}</Text>
                  <Text fontSize="sm" color="gray.600">{event.username}</Text>
                </Td>
                <Td>
                  <HStack color="gray.600" fontSize="sm">
                    <Icon as={FiCalendar} />
                    <Text>
                      {new Date(event.timeStart).toLocaleDateString('vi-VN')}
                    </Text>
                  </HStack>
                  <HStack color="gray.600" fontSize="sm">
                    <Icon as={FiClock} />
                    <Text>
                      {new Date(event.timeStart).toLocaleTimeString('vi-VN', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                      {' - '}
                      {new Date(event.timeEnd).toLocaleTimeString('vi-VN', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </Text>
                  </HStack>
                </Td>
                <Td>
                  <Badge 
                    colorScheme={event.status === 'Đã Tạo' ? 'green' : 'yellow'}
                  >
                    {event.status}
                  </Badge>
                </Td>
                <Td>
                  <HStack spacing={2} justify="flex-end">
                    <IconButton
                      aria-label="View details"
                      icon={<Icon as={FiInfo} />}
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setSelectedEvent(event);
                        onDetailOpen();
                      }}
                    />
                    <IconButton
                      aria-label="Edit event"
                      icon={<Icon as={FiEdit2} />}
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setSelectedEvent(event);
                        onFormOpen();
                      }}
                    />
                    <IconButton
                      aria-label="Delete event"
                      icon={<Icon as={FiTrash2} />}
                      size="sm"
                      variant="ghost"
                      colorScheme="red"
                      onClick={() => {
                        setEventToDelete(event);
                        onDeleteOpen();
                      }}
                    />
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>

        {/* Pagination */}
        {!searchQuery && filteredEvents.length > 0 && (
          <ProductPagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
            loading={loading}
          />
        )}

        {/* Empty State */}
        {filteredEvents.length === 0 && (
          <Flex 
            direction="column" 
            align="center" 
            justify="center" 
            py={10}
            bg="gray.50"
            borderRadius="lg"
          >
            <Icon as={FiCalendar} fontSize="3xl" color="gray.400" mb={2} />
            <Text color="gray.500">
              Không tìm thấy sự kiện nào
            </Text>
            <Button
              mt={4}
              size="sm"
              leftIcon={<Icon as={FiRefreshCcw} />}
              onClick={() => {
                setSearchQuery('');
                fetchEvents(1);
              }}
            >
              Đặt lại bộ lọc
            </Button>
          </Flex>
        )}

        {/* Delete Confirmation Dialog */}
        <AlertDialog
          isOpen={isDeleteOpen}
          leastDestructiveRef={cancelRef}
          onClose={onDeleteClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Xóa sự kiện
              </AlertDialogHeader>

              <AlertDialogBody>
                Bạn có chắc chắn muốn xóa sự kiện "{eventToDelete?.title}"? 
                Hành động này không thể hoàn tác.
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onDeleteClose}>
                  Hủy
                </Button>
                <Button colorScheme="red" onClick={handleDeleteEvent} ml={3}>
                  Xóa
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>

        {/* Event Detail Modal */}
        <EventDetailModal
          isOpen={isDetailOpen}
          onClose={onDetailClose}
          event={selectedEvent}
        />

        {/* Event Form Modal */}
        <EventFormModal
          isOpen={isFormOpen}
          onClose={() => {
            onFormClose();
            setSelectedEvent(null);
          }}
          onSubmit={selectedEvent ? handleUpdateEvent : handleAddEvent}
          initialData={selectedEvent}
          title={selectedEvent ? 'Chỉnh sửa sự kiện' : 'Thêm sự kiện mới'}
        />
      </Stack>
    </Box>
  );
}