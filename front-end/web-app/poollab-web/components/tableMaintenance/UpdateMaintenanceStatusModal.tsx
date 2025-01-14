import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  VStack,
  Text,
  HStack,
  Badge,
} from '@chakra-ui/react';
import { TableMaintenance } from '@/utils/types/tableMaintenance.types';

interface UpdateMaintenanceStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  maintenance: TableMaintenance | null;
  onUpdateStatus: (status: string) => Promise<void>;
}

const STATUS_OPTIONS = ['Tích Hợp', 'Thanh Toán', 'Báo Cáo'] as const;

export const UpdateMaintenanceStatusModal = ({
  isOpen,
  onClose,
  maintenance,
  onUpdateStatus,
}: UpdateMaintenanceStatusModalProps) => {
  if (!maintenance) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Cập nhật trạng thái bảo trì</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <VStack spacing={4} align="stretch">
            <HStack justify="space-between">
              <Text fontWeight="medium">Mã bảo trì:</Text>
              <Text>{maintenance.tableMainCode}</Text>
            </HStack>

            <HStack justify="space-between">
              <Text fontWeight="medium">Trạng thái hiện tại:</Text>
              <Badge colorScheme={maintenance.status === 'Hoàn Thành' ? 'green' : 'yellow'}>
                {maintenance.status}
              </Badge>
            </HStack>

            <Text fontWeight="medium" mt={4}>Chọn trạng thái mới:</Text>
            <HStack spacing={3}>
              {STATUS_OPTIONS.map((status) => (
                <Button
                  key={status}
                  size="sm"
                  colorScheme={status === maintenance.status ? 'blue' : 'gray'}
                  onClick={() => onUpdateStatus(status)}
                >
                  {status}
                </Button>
              ))}
            </HStack>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};