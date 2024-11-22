import { Tr, Td, Badge, HStack, IconButton, Icon, Image } from '@chakra-ui/react';
import { FiInfo, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { BilliardTable } from '@/utils/types/table.types';

interface BilliardTableRowProps {
  table: BilliardTable;
  index: number;
}

export const BilliardTableRow = ({ table, index }: BilliardTableRowProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  return (
    <Tr>
      <Td>{index + 1}</Td>
      <Td>
        <Image
          src={table.image || '/api/placeholder/100/100'}
          alt={table.name}
          boxSize="50px"
          objectFit="cover"
          borderRadius="md"
        />
      </Td>
      <Td>{table.name}</Td>
      <Td>{table.billiardTypeId}</Td>
      <Td>{formatDate(table.createdDate)}</Td>
      <Td>{table.updatedDate ? formatDate(table.updatedDate) : '-'}</Td>
      <Td>
        <Badge
          colorScheme={
            table.status.toLowerCase() === 'bàn trống' ? 'green' :
            table.status.toLowerCase() === 'đang sử dụng' ? 'red' :
            'yellow'
          }
        >
          {table.status}
        </Badge>
      </Td>
      <Td>
        <HStack spacing={2} justify="flex-end">
          <IconButton
            aria-label="View details"
            icon={<Icon as={FiInfo} />}
            size="sm"
            variant="ghost"
          />
          <IconButton
            aria-label="Edit table"
            icon={<Icon as={FiEdit2} />}
            size="sm"
            variant="ghost"
          />
          <IconButton
            aria-label="Delete table"
            icon={<Icon as={FiTrash2} />}
            size="sm"
            variant="ghost"
            colorScheme="red"
          />
        </HStack>
      </Td>
    </Tr>
  );
};