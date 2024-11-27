import { 
  Td,
  Badge, 
  HStack, 
  IconButton, 
  Icon,
  useDisclosure,
} from '@chakra-ui/react';
import { FiInfo, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { Area, BilliardPrice, BilliardTable, BilliardType, TableDetail } from '@/utils/types/table.types';
import { TableDetailModal } from './TableDetailModal';
import { UpdateTableModal } from './UpdateTableModal';

interface BilliardTableRowProps {
  table: BilliardTable;
  index: number;
  onDelete: (id: string) => void;
  onViewDetail: (id: string) => Promise<void>;
  onUpdate: (tableId: string, data: any, imageFile?: File) => Promise<void>;
  onUpdateStatus: (tableId: string, status: string) => Promise<void>;
  selectedTable: TableDetail | null;
  detailLoading: boolean;
  areas: Area[];
  types: BilliardType[];
  prices: BilliardPrice[];
}

export const BilliardTableRow = ({ 
  table, 
  index, 
  onDelete,
  onViewDetail,
  onUpdate,
  onUpdateStatus,
  selectedTable,
  detailLoading,
  areas,
  types,
  prices
}: BilliardTableRowProps) => {
  const { 
    isOpen: isDetailOpen, 
    onOpen: onDetailOpen, 
    onClose: onDetailClose 
  } = useDisclosure();

  const {
    isOpen: isUpdateOpen,
    onOpen: onUpdateOpen,
    onClose: onUpdateClose
  } = useDisclosure();

  const handleViewDetail = async () => {
    try {
      await onViewDetail(table.id);
      onDetailOpen();
    } catch (error) {
      console.error('Error viewing detail:', error);
    }
  };

  const handleUpdateStatus = async (status: string) => {
    try {
      await onUpdateStatus(table.id, status);
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'bàn trống': return 'green';
      case 'đang sử dụng': return 'red';
      case 'đang bảo trì': return 'yellow';
      default: return 'gray';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  return (
    <>
      <Td>{index + 1}</Td>
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
          />
          <IconButton
            aria-label="Chỉnh sửa"
            icon={<Icon as={FiEdit2} />}
            size="sm"
            variant="ghost"
            onClick={onUpdateOpen}
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

      {/* Detail Modal */}
      <TableDetailModal
        isOpen={isDetailOpen}
        onClose={onDetailClose}
        tableDetail={selectedTable}
        loading={detailLoading}
      />

      {/* Update Modal */}
      <UpdateTableModal 
        isOpen={isUpdateOpen}
        onClose={onUpdateClose}
        table={table}
        onUpdate={onUpdate}
        onUpdateStatus={onUpdateStatus}
        areas={areas}
        types={types}
        prices={prices}
      />
    </>
  );
};