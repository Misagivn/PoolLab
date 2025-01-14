import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Stack,
  HStack,
  VStack,
  Text,
  Badge,
  Divider,
} from '@chakra-ui/react';
import { TableMaintenance } from '@/utils/types/tableMaintenance.types';

interface TableMaintenanceDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  maintenance: TableMaintenance | null;
}

export const TableMaintenanceDetailModal = ({
  isOpen,
  onClose,
  maintenance
}: TableMaintenanceDetailModalProps) => {
  if (!maintenance) return null;

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Chi tiết bảo trì</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Stack spacing={4}>
            <VStack align="stretch" spacing={3}>
              <HStack justify="space-between">
                <Text fontWeight="bold" fontSize="xl">
                  Mã bảo trì: {maintenance.tableMainCode}
                </Text>
                <Badge colorScheme={maintenance.status === 'Hoàn Thành' ? 'green' : 'yellow'}>
                  {maintenance.status}
                </Badge>
              </HStack>

              <Divider />

              <HStack justify="space-between">
                <Text fontWeight="medium">Bàn:</Text>
                <Text>{maintenance.tableName}</Text>
              </HStack>

              {maintenance.tableIssuesCode && (
                <HStack justify="space-between">
                  <Text fontWeight="medium">Mã sự cố:</Text>
                  <Text>{maintenance.tableIssuesCode}</Text>
                </HStack>
              )}

              <HStack justify="space-between">
                <Text fontWeight="medium">Nhân viên kỹ thuật:</Text>
                <Text>{maintenance.staffName}</Text>
              </HStack>

              <VStack align="start" spacing={1}>
                <Text fontWeight="medium">Lý do bảo trì:</Text>
                <Text>{maintenance.reason}</Text>
              </VStack>

              <HStack justify="space-between">
                <Text fontWeight="medium">Chi phí ước tính:</Text>
                <Text>{formatPrice(maintenance.estimatedCost)}</Text>
              </HStack>

              <Divider />

              <HStack justify="space-between">
                <Text fontWeight="medium">Ngày bắt đầu:</Text>
                <Text>{formatDateTime(maintenance.startDate)}</Text>
              </HStack>

              <HStack justify="space-between">
                <Text fontWeight="medium">Ngày kết thúc dự kiến:</Text>
                <Text>{formatDateTime(maintenance.endDate)}</Text>
              </HStack>

              <Divider />

              <HStack justify="space-between">
                <Text fontWeight="medium">Ngày tạo:</Text>
                <Text>{formatDateTime(maintenance.createdDate)}</Text>
              </HStack>

              {maintenance.updatedDate && (
                <HStack justify="space-between">
                  <Text fontWeight="medium">Cập nhật lần cuối:</Text>
                  <Text>{formatDateTime(maintenance.updatedDate)}</Text>
                </HStack>
              )}
            </VStack>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};