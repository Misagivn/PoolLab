import {
  Flex,
  InputGroup,
  InputLeftElement,
  Input,
  Select,
  IconButton,
  Icon,
} from '@chakra-ui/react';
import { FiSearch, FiRefreshCcw } from 'react-icons/fi';
import { TableFilters } from '@/utils/types/table.types';

interface TableFiltersProps {
  filters: TableFilters;
  onFiltersChange: (filters: TableFilters) => void;
  onRefresh: () => void;
}

export const TableFiltersProps = ({ filters, onFiltersChange, onRefresh }: TableFiltersProps) => (
  <Flex gap={4} wrap="wrap">
    <InputGroup maxW={{ base: "100%", md: "320px" }}>
      <InputLeftElement>
        <Icon as={FiSearch} color="gray.400" />
      </InputLeftElement>
      <Input
        bg="white"
        placeholder="Tìm kiếm bàn..."
        value={filters.searchQuery}
        onChange={(e) => onFiltersChange({ ...filters, searchQuery: e.target.value })}
      />
    </InputGroup>

    <Select
      w={{ base: "100%", md: "200px" }}
      bg="white"
      value={filters.statusFilter}
      onChange={(e) => onFiltersChange({ ...filters, statusFilter: e.target.value })}
    >
      <option value="all">Tất cả trạng thái</option>
      <option value="bàn trống">Bàn trống</option>
      <option value="đang sử dụng">Đang sử dụng</option>
      <option value="đang bảo trì">Đang bảo trì</option>
    </Select>

    <IconButton
      aria-label="Refresh"
      icon={<Icon as={FiRefreshCcw} />}
      onClick={onRefresh}
    />
  </Flex>
);
