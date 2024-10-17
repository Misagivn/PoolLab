// File: /app/table/page.tsx
import React from 'react';
import TableList from '../components/tablelist';
import TableDetails from '../components/tabledetail';
import { Flex } from '@chakra-ui/react';

export default function TablePage() {
  return (
    <Flex>
      <TableList />
      <TableDetails />
    </Flex>
  );
}
