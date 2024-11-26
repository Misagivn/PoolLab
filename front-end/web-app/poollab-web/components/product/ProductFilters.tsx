import React from 'react';
import {
  Stack,
  InputGroup,
  InputLeftElement,
  Input,
  Select,
  IconButton,
  Icon,
} from '@chakra-ui/react';
import { FiSearch, FiRefreshCcw } from 'react-icons/fi';
import { ProductFilters } from '@/utils/types/product.types';

interface ProductFiltersProps {
  filters: ProductFilters;
  onFiltersChange: (filters: ProductFilters) => void;
  onRefresh: () => void;
  groups: string[];
  statuses: string[];
  loading?: boolean;
}

export const ProductFiltersProps: React.FC<ProductFiltersProps> = ({
  filters,
  onFiltersChange,
  onRefresh,
  groups,
  statuses,
  loading
}) => {
  return (
    <Stack
      direction={{ base: 'column', md: 'row' }}
      spacing={4}
      mb={6}
    >
      <InputGroup maxW={{ base: 'full', md: '320px' }}>
        <InputLeftElement>
          <Icon as={FiSearch} color="gray.400" />
        </InputLeftElement>
        <Input
          placeholder="Tìm kiếm sản phẩm..."
          value={filters.search}
          onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
          disabled={loading}
        />
      </InputGroup>

      <Select
        value={filters.groupName}
        onChange={(e) => onFiltersChange({ ...filters, groupName: e.target.value })}
        disabled={loading}
      >
        <option value="all">Tất cả nhóm</option>
        {groups.map(group => (
          <option key={group} value={group}>{group}</option>
        ))}
      </Select>

      <Select
        value={filters.status}
        onChange={(e) => onFiltersChange({ ...filters, status: e.target.value })}
        disabled={loading}
      >
        <option value="all">Tất cả trạng thái</option>
        {statuses.map(status => (
          <option key={status} value={status}>{status}</option>
        ))}
      </Select>

      <IconButton
        aria-label="Refresh"
        icon={<Icon as={FiRefreshCcw} />}
        onClick={onRefresh}
        disabled={loading}
      />
    </Stack>
  );
};