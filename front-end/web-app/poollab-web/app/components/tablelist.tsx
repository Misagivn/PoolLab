// File: /app/components/tablelist.tsx
'use client';
import React from 'react';
import { Box, Image, Text, SimpleGrid, VStack } from '@chakra-ui/react';
import { Table } from '../table/page';

interface TableListProps {
  onSelectTable: (table: Table) => void;
}

const tables: Table[] = [
  { id: 1, name: 'Bàn 1', status: 'available', imageUrl: '/pool-table (1).png' },
  { id: 2, name: 'Bàn 2', status: 'occupied', imageUrl: '/pool-table (1).png' },
  { id: 3, name: 'Bàn 3', status: 'reserved', imageUrl: '/pool-table (1).png' },
  // Thêm các bàn khác nếu cần
];

export default function TableList({ onSelectTable }: TableListProps) {
  return (
    <Box w="70%" p={4} bg="gray.100" overflowY="auto" maxH="100vh">
      <SimpleGrid columns={3} spacing={4}>
        {tables.map((table) => (
          <VStack
            key={table.id}
            bg="white"
            p={4}
            borderRadius="md"
            boxShadow="md"
            onClick={() => onSelectTable(table)}
            cursor="pointer"
            _hover={{ boxShadow: 'lg' }}
          >
            <Image src={table.imageUrl} alt={table.name} borderRadius="md" />
            <Text fontWeight="bold">{table.name}</Text>
            <Text color={table.status === 'available' ? 'green.500' : table.status === 'occupied' ? 'red.500' : 'orange.500'}>
              {table.status === 'available' ? 'Trống' : table.status === 'occupied' ? 'Đã đặt' : 'Đã đặt trước'}
            </Text>
          </VStack>
        ))}
      </SimpleGrid>
    </Box>
  );
}
