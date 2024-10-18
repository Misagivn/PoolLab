// File: /app/table/page.tsx
'use client';
import React, { useState } from 'react';
import TableList from '../components/tablelist';
import TableDetails from '../components/tabledetail';
import { Flex, ChakraProvider } from '@chakra-ui/react';

export interface Table {
  id: number;
  name: string;
  status: 'available' | 'occupied' | 'reserved' | 'maintenance';
  imageUrl: string;
}

export default function TablePage() {
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);

  const handleConfirmTable = (table: Table) => {
    setSelectedTable(table);
  };

  return (
    <ChakraProvider>
      <Flex>
        <TableList onConfirmTable={handleConfirmTable} />
        <TableDetails selectedTable={selectedTable} />
      </Flex>
    </ChakraProvider>
  );
}
