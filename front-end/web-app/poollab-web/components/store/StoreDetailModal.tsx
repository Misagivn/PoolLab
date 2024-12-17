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
import { FiPhone, FiMapPin, FiClock, FiStar } from 'react-icons/fi';
import { Store } from '@/utils/types/store';

interface StoreDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  store: Store | null;
}

export const StoreDetailModal = ({ isOpen, onClose, store }: StoreDetailModalProps) => {
  if (!store) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Chi tiết cửa hàng</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Stack spacing={6}>
            {store.storeImg && (
              <Box borderRadius="md" overflow="hidden">
                <Image 
                  src={store.storeImg} 
                  alt={store.name}
                  width="100%"
                  height="auto"
                  fallbackSrc="https://via.placeholder.com/400x200"
                />
              </Box>
            )}

            <VStack align="start" spacing={4}>
              <Box>
                <Text fontWeight="bold" fontSize="xl">
                  {store.name}
                </Text>
                <HStack spacing={2} mt={1}>
                <Badge colorScheme={store.status === 'Hoạt Động' ? 'green' : 'red'}>
                    {store.status}
                  </Badge>
                  <HStack spacing={1}>
                    <Icon as={FiStar} color="yellow.400" />
                    <Text>{store.rated}</Text>
                  </HStack>
                </HStack>
              </Box>

              <VStack align="start" spacing={2} width="100%">
                <HStack>
                  <Icon as={FiMapPin} color="gray.500" />
                  <Text>{store.address}</Text>
                </HStack>

                <HStack>
                  <Icon as={FiPhone} color="gray.500" />
                  <Text>{store.phoneNumber}</Text>
                </HStack>

                {(store.timeStart || store.timeEnd) && (
                  <HStack>
                    <Icon as={FiClock} color="gray.500" />
                    <Text>
                      {store.timeStart || '00:00'} - {store.timeEnd || '24:00'}
                    </Text>
                  </HStack>
                )}
              </VStack>

              {store.descript && (
                <Box>
                  <Text fontWeight="semibold" mb={1}>Mô tả:</Text>
                  <Text color="gray.600">{store.descript}</Text>
                </Box>
              )}

              <Box width="100%">
                <Text fontWeight="semibold" mb={1}>Thông tin thêm:</Text>
                <Stack spacing={1} fontSize="sm" color="gray.600">
                  <Text>Ngày tạo: {new Date(store.createdDate).toLocaleDateString('vi-VN')}</Text>
                  {store.updatedDate && (
                    <Text>
                      Cập nhật lần cuối: {new Date(store.updatedDate).toLocaleDateString('vi-VN')}
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