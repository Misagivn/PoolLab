import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  VStack,
  Button,
  useToast,
  Text,
  HStack,
  Badge,
} from '@chakra-ui/react';
import { BilliardTable } from '@/utils/types/table.types';
import { billiardTableApi } from '@/apis/table.api';

interface TableStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  table: BilliardTable | null;
  onStatusUpdate: () => void;
}

export const TableStatusModal = ({
  isOpen,
  onClose,
  table,
  onStatusUpdate
}: TableStatusModalProps) => {
  const toast = useToast();

  if (!table) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Bàn Trống':
        return 'green';
      case 'Có Khách':
        return 'red';
      case 'Vô Hiệu':
        return 'yellow';
      default:
        return 'gray';
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    try {
      const response = await billiardTableApi.updateTableStatus(table.id, newStatus);
      
      if (response.status === 200) {
        toast({
          title: 'Thành công',
          description: 'Cập nhật trạng thái bàn thành công',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        onStatusUpdate();
        onClose();
      }
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Không thể cập nhật trạng thái bàn',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleInactive = async () => {
    try {
      const response = await billiardTableApi.inactiveTable(table.id);
      
      if (response.status === 200) {
        toast({
          title: 'Thành công',
          description: 'Chuyển trạng thái bảo trì thành công',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        onStatusUpdate();
        onClose();
      }
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Không thể chuyển trạng thái bảo trì',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };


  const isEmptyTableButtonDisabled = table.status === 'Bàn Trống' || table.status === 'Có Khách';
  const isOccupiedButtonDisabled = table.status === 'Bàn Trống' || table.status === 'Có Khách' || table.status === 'Vô Hiệu';
  const isInactiveButtonDisabled = table.status === 'Vô Hiệu' || table.status === 'Có Khách';

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Cập nhật trạng thái bàn</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <VStack spacing={4} align="stretch">
            <HStack justify="space-between">
              <Text fontWeight="bold">Bàn hiện tại:</Text>
              <Text>{table.name}</Text>
            </HStack>

            <HStack justify="space-between">
              <Text fontWeight="bold">Trạng thái hiện tại:</Text>
              <Badge colorScheme={getStatusColor(table.status)}>{table.status}</Badge>
            </HStack>

            <VStack spacing={3} pt={4}>
              <Button
                w="full"
                colorScheme="green"
                onClick={() => handleStatusUpdate('Bàn Trống')}
                isDisabled={isEmptyTableButtonDisabled}
              >
                Đánh dấu bàn trống
              </Button>

              <Button
                w="full"
                colorScheme="red"
                onClick={() => handleStatusUpdate('Có Khách')}
                isDisabled={isOccupiedButtonDisabled}
              >
                Đánh dấu có khách
              </Button>

              <Button
                w="full"
                colorScheme="yellow"
                onClick={handleInactive}
                isDisabled={isInactiveButtonDisabled}
              >
                Vô hiệu hóa bàn
              </Button>
            </VStack>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};