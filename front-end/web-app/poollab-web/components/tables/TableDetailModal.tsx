import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  VStack,
  HStack,
  Text,
  Badge,
  Image,
  Box,
  Spinner,
  Icon,
  Divider,
} from '@chakra-ui/react';
import { FiMapPin, FiClock, FiDollarSign, FiGrid } from 'react-icons/fi';
import { TableDetail } from '@/utils/types/table.types';

interface TableDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  tableDetail: TableDetail | null;
  loading: boolean;
}

export const TableDetailModal = ({
  isOpen,
  onClose,
  tableDetail,
  loading
}: TableDetailModalProps) => {
  if (loading) {
    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalBody>
            <VStack py={8}>
              <Spinner size="xl" />
              <Text>Đang tải thông tin...</Text>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  }

  if (!tableDetail) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'bàn trống':
        return 'green';
      case 'đang sử dụng':
        return 'red';
      case 'đang bảo trì':
        return 'yellow';
      default:
        return 'gray';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Chi tiết bàn Billiard</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <VStack spacing={4} align="stretch">
            <Box>
              <Image
                src={tableDetail.image}
                alt={tableDetail.name}
                borderRadius="md"
                w="100%"
                h="200px"
                objectFit="cover"
                fallbackSrc="/placeholder-image.png"
              />
            </Box>

            <HStack justify="space-between">
              <Text fontSize="xl" fontWeight="bold">{tableDetail.name}</Text>
              <Badge colorScheme={getStatusColor(tableDetail.status)}>
                {tableDetail.status}
              </Badge>
            </HStack>

            <Text color="gray.600">{tableDetail.descript}</Text>

            <Divider />

            <VStack align="stretch" spacing={3}>
              <HStack>
                <Icon as={FiGrid} color="blue.500" />
                <Text fontWeight="medium">Loại bàn:</Text>
                <Text>{tableDetail.billiardTypeName}</Text>
              </HStack>

              <HStack>
                <Icon as={FiMapPin} color="blue.500" />
                <Text fontWeight="medium">Khu vực:</Text>
                <Text>{tableDetail.areaName}</Text>
              </HStack>

              <HStack>
                <Icon as={FiDollarSign} color="blue.500" />
                <Text fontWeight="medium">Giá:</Text>
                <Text>{tableDetail.bidaPrice.toLocaleString()}đ/giờ</Text>
              </HStack>

              <HStack>
                <Icon as={FiClock} color="blue.500" />
                <Text fontWeight="medium">Ngày tạo:</Text>
                <Text>{formatDate(tableDetail.createdDate)}</Text>
              </HStack>
            </VStack>

            <Divider />

            <Box bg="gray.50" p={4} borderRadius="md">
              <Text fontWeight="bold" mb={2}>Thông tin cửa hàng</Text>
              <VStack align="stretch" spacing={2}>
                <Text>{tableDetail.storeName}</Text>
                <Text color="gray.600">{tableDetail.address}</Text>
              </VStack>
            </Box>

            {tableDetail.qrcode && (
              <Box>
                <Text fontWeight="bold" mb={2}>Mã QR</Text>
                <Image
                  src={tableDetail.qrcode}
                  alt="QR Code"
                  boxSize="150px"
                  objectFit="contain"
                />
              </Box>
            )}
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};