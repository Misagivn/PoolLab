//tablelist
'use client';
import React, { useState } from 'react';
import { Box, Text, SimpleGrid, VStack, Input, Flex, Image, Button, HStack, InputGroup, InputLeftElement, Radio, RadioGroup } from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';

interface Table {
  id: number;
  name: string;
  status: 'available' | 'occupied' | 'reserved';
  type: 'phang' | 'lo' | 'lip';
  imageUrl: string;
}

interface TableListProps {
  onSelectTable: (table: Table) => void;
}

const tables: Table[] = [
  { id: 1, name: 'Bàn 1', status: 'available', type: 'phang', imageUrl: '/assets/phang.png' },
  { id: 2, name: 'Bàn 2', status: 'occupied', type: 'lo', imageUrl: '/assets/lo.png' },
  { id: 3, name: 'Bàn 3', status: 'reserved', type: 'lip', imageUrl: '/assets/lip.png' },
  { id: 4, name: 'Bàn 4', status: 'available', type: 'phang', imageUrl: '/assets/phang.png' },
  { id: 5, name: 'Bàn 5', status: 'occupied', type: 'lo', imageUrl: '/assets/lo.png' },
  { id: 6, name: 'Bàn 6', status: 'occupied', type: 'lip', imageUrl: '/assets/lip.png' },
  { id: 7, name: 'Bàn 7', status: 'occupied', type: 'phang', imageUrl: '/assets/phang.png' },
  { id: 8, name: 'Bàn 8', status: 'occupied', type: 'lo', imageUrl: '/assets/lo.png' },
  // Add more tables as needed
];

export default function TableList({ onSelectTable }: TableListProps) {
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTables = tables.filter(table => {
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'used' && (table.status === 'occupied' || table.status === 'reserved')) ||
      (statusFilter === 'available' && table.status === 'available');
    
    const matchesType = typeFilter === 'all' || table.type === typeFilter;
    
    const matchesSearch = table.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesType && matchesSearch;
  });

  const getFilterCounts = () => {
    const allCount = tables.length;
    const usedCount = tables.filter(t => t.status === 'occupied' || t.status === 'reserved').length;
    const availableCount = tables.filter(t => t.status === 'available').length;
    return { allCount, usedCount, availableCount };
  };

  const { allCount, usedCount, availableCount } = getFilterCounts();

  return (
    <Box h="100%" p={4} bg="gray.50" overflowY="auto">
      <HStack mb={4} spacing={2}>
        <Button 
          onClick={() => setTypeFilter('all')} 
          colorScheme={typeFilter === 'all' ? 'blue' : 'gray'}
        >
          Tất cả
        </Button>
        <Button 
          onClick={() => setTypeFilter('phang')} 
          colorScheme={typeFilter === 'phang' ? 'blue' : 'gray'}
        >
          Phăng
        </Button>
        <Button 
          onClick={() => setTypeFilter('lo')} 
          colorScheme={typeFilter === 'lo' ? 'blue' : 'gray'}
        >
          Lỗ
        </Button>
        <Button 
          onClick={() => setTypeFilter('lip')} 
          colorScheme={typeFilter === 'lip' ? 'blue' : 'gray'}
        >
          Lip
        </Button>
      </HStack>
      
      <Flex mb={4} justifyContent="space-between" alignItems="center">
        <RadioGroup onChange={setStatusFilter} value={statusFilter}>
          <HStack spacing={4}>
            <Radio value="all">Tất cả ({allCount})</Radio>
            <Radio value="used">Sử dụng ({usedCount})</Radio>
            <Radio value="available">Còn trống ({availableCount})</Radio>
          </HStack>
        </RadioGroup>
        <InputGroup maxW="200px">
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.300" />
          </InputLeftElement>
          <Input 
            placeholder="Tìm kiếm bàn..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>
      </Flex>
      
      <SimpleGrid columns={5} spacing={4}>
        {filteredTables.map((table) => (
          <VStack
            key={table.id}
            bg="white"
            p={2}
            borderRadius="md"
            boxShadow="sm"
            onClick={() => onSelectTable(table)}
            cursor="pointer"
            _hover={{ boxShadow: 'md' }}
            alignItems="center"
          >
            <Image src={table.imageUrl} alt={table.name} boxSize="40px" objectFit="contain" />
            <Text fontWeight="bold" fontSize="sm">{table.name}</Text>
            <Text fontSize="xs" color={table.status === 'available' ? 'green.500' : table.status === 'occupied' ? 'red.500' : 'orange.500'}>
              {table.status === 'available' ? 'Trống' : table.status === 'occupied' ? 'Đã đặt' : 'Đã đặt trước'}
            </Text>
            <Text fontSize="xs">{table.type.charAt(0).toUpperCase() + table.type.slice(1)}</Text>
          </VStack>
        ))}
      </SimpleGrid>
    </Box>
  );
}