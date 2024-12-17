import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Stack,
  VStack,
  Text,
  Box,
  Image,
  HStack,
  Badge,
  Icon,
 } from '@chakra-ui/react';
 import { FiMapPin, FiUser, FiClock, FiCalendar } from 'react-icons/fi';
 import { Event } from '@/utils/types/event.types';
 
 interface EventDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event | null;
 }
 
 export const EventDetailModal = ({ isOpen, onClose, event }: EventDetailModalProps) => {
  if (!event) return null;
 
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Chi tiết sự kiện</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Stack spacing={6}>
            {event.thumbnail && (
              <Box borderRadius="md" overflow="hidden">
                <Image 
                  src={event.thumbnail} 
                  alt={event.title}
                  width="100%"
                  height="auto"
                  maxH="300px"
                  objectFit="cover"
                  fallbackSrc="https://via.placeholder.com/400x200"
                />
              </Box>
            )}
 
            <VStack align="start" spacing={4}>
              <Box>
                <Text fontWeight="bold" fontSize="xl">
                  {event.title}
                </Text>
                <HStack spacing={2} mt={1}>
                  <Badge colorScheme={event.status === 'Đã Tạo' ? 'green' : 'yellow'}>
                    {event.status}
                  </Badge>
                </HStack>
              </Box>
 
              <VStack align="start" spacing={2} width="100%">
                <HStack>
                  <Icon as={FiUser} color="gray.500" />
                  <Text fontWeight="semibold" mr={1}>Người tạo:</Text>
                  <Text>{event.fullName}</Text>
                  <Text color="gray.500">({event.username})</Text>
                </HStack>
 
                {event.storeName && (
                  <HStack>
                    <Icon as={FiMapPin} color="gray.500" />
                    <Text fontWeight="semibold" mr={1}>Cửa hàng:</Text>
                    <Text>{event.storeName}</Text>
                  </HStack>
                )}
 
                <HStack>
                  <Icon as={FiCalendar} color="gray.500" />
                  <Text fontWeight="semibold" mr={1}>Thời gian:</Text>
                  <Text>
                    {new Date(event.timeStart).toLocaleDateString('vi-VN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </Text>
                </HStack>
 
                <HStack>
                  <Icon as={FiClock} color="gray.500" />
                  <Text fontWeight="semibold" mr={1}>Giờ:</Text>
                  <Text>
                    {`${new Date(event.timeStart).toLocaleTimeString('vi-VN', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })} - ${new Date(event.timeEnd).toLocaleTimeString('vi-VN', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}`}
                  </Text>
                </HStack>
              </VStack>
 
              <Box width="100%">
                <Text fontWeight="semibold" mb={2}>Mô tả:</Text>
                <Text color="gray.600" whiteSpace="pre-wrap">
                  {event.descript}
                </Text>
              </Box>
 
              <Box width="100%">
                <Text fontWeight="semibold" mb={1}>Thông tin thêm:</Text>
                <Stack spacing={1} fontSize="sm" color="gray.600">
                  <Text>
                    Ngày tạo: {new Date(event.createdDate).toLocaleDateString('vi-VN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </Text>
                  {event.updatedDate && (
                    <Text>
                      Cập nhật lần cuối: {new Date(event.updatedDate).toLocaleDateString('vi-VN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </Text>
                  )}
                </Stack>
              </Box>
            </VStack>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
 };