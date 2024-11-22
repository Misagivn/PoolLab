import { Tr, Td, Badge, HStack, IconButton, Icon, Image, useDisclosure } from '@chakra-ui/react';
import { FiInfo, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { BilliardTable, TableDetail } from '@/utils/types/table.types';
import { TableDetailModal } from './TableDetailModal';

interface BilliardTableRowProps {
  table: BilliardTable;
  index: number;
  onDelete: (id: string) => void;
  onViewDetail: (id: string) => Promise<void>;
  selectedTable: TableDetail | null;
  detailLoading: boolean;
}

export const BilliardTableRow = ({ 
  table, 
  index, 
  onDelete,
  onViewDetail,
  selectedTable,
  detailLoading 
}: BilliardTableRowProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const handleViewDetail = async () => {
    try {
      await onViewDetail(table.id);
      onOpen();
    } catch (error) {
      console.error('Error viewing detail:', error);
    }
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
    <>
      <Tr>
        <Td>{index + 1}</Td>
        <Td>
          <Image
            src={table.image}
            alt={table.name}
            boxSize="50px"
            objectFit="cover"
            borderRadius="md"
            fallbackSrc="/placeholder-image.png"
          />
        </Td>
        <Td>{table.name}</Td>
        <Td>{table.bidaTypeName}</Td>
        <Td>{table.areaName}</Td>
        <Td>{formatDate(table.createdDate)}</Td>
        <Td>{table.updatedDate ? formatDate(table.updatedDate) : '-'}</Td>
        <Td>
          <Badge colorScheme={getStatusColor(table.status)}>
            {table.status}
          </Badge>
        </Td>
        <Td>
          <HStack spacing={2} justify="flex-end">
            <IconButton
              aria-label="Xem chi tiết"
              icon={<Icon as={FiInfo} />}
              size="sm"
              variant="ghost"
              onClick={handleViewDetail}
              isLoading={detailLoading}
            />
            <IconButton
              aria-label="Chỉnh sửa"
              icon={<Icon as={FiEdit2} />}
              size="sm"
              variant="ghost"
            />
            <IconButton
              aria-label="Xóa bàn"
              icon={<Icon as={FiTrash2} />}
              size="sm"
              variant="ghost"
              colorScheme="red"
              onClick={() => onDelete(table.id)}
            />
          </HStack>
        </Td>
      </Tr>

      <TableDetailModal
        isOpen={isOpen}
        onClose={onClose}
        tableDetail={selectedTable}
        loading={detailLoading}
      />
    </>
  );
};