// File: /app/table/page.tsx
'use client';
import React, { useState } from 'react';
import TableList from '../components/tablelist';
import TableDetails from '../components/tabledetail';
import { Flex } from '@chakra-ui/react';

export interface Table {
  id: number;
  name: string;
  status: 'available' | 'occupied' | 'reserved';
  imageUrl: string;
}

export default function TablePage() {
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);

  return (
    <Flex>
      <TableList onSelectTable={setSelectedTable} />
      <TableDetails selectedTable={selectedTable} />
    </Flex>
  );
}
