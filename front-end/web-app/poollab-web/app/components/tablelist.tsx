// File: /app/table/components/TableList.tsx
'use client';
import React from 'react';
import { Button, Box, Grid, Heading } from '@chakra-ui/react';

interface Table {
  id: number;
  name: string;
  available: boolean;
}

const tables: Table[] = [
  { id: 1, name: 'Bàn 1', available: true },
  { id: 2, name: 'Bàn 2', available: false },
  { id: 3, name: 'Bàn 3', available: true },
  // Thêm các bàn khác ở đây
];

export default function TableList() {
  const handleTableClick = (table: Table) => {
    if (table.available) {
      // Xử lý logic khi chọn bàn
      console.log(`Bàn ${table.name} được chọn`);
    } else {
      alert('Bàn này hiện không khả dụng');
    }
  };

  return (
    <Box w="50%" p={4} bg="gray.100" overflowY="auto">
      <Heading as="h2" size="xl" mb={4}>Danh sách bàn</Heading>
      <Grid templateColumns="repeat(3, 1fr)" gap={4}>
        {tables.map((table) => (
          <Button
            key={table.id}
            onClick={() => handleTableClick(table)}
            colorScheme={table.available ? 'blue' : 'gray'}
            size="lg"
            height="20"
          >
            {table.name}
          </Button>
        ))}
      </Grid>
    </Box>
  );
}
