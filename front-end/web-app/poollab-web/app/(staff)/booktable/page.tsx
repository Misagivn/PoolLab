'use client';
import React, { useState } from 'react';
import { Flex, Box, Tabs, TabList, Tab, TabPanels, TabPanel } from '@chakra-ui/react';
import TableList from '../../components/tablelist';
import TableDetails from '../../components/tabledetail';
import OrderTab from '../../components/order';

export interface Table {
  id: number;
  name: string;
  status: 'available' | 'occupied' | 'reserved';
  imageUrl: string;
}

export default function TablePage() {
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);

  return (
    <Flex h="100%" w="100%" flexDirection="column">
      <Tabs size="md" variant="enclosed" display="flex" flexDirection="column" h="100%">
        <TabList>
          <Tab>Table</Tab>
          <Tab>Order</Tab>
        </TabList>
        <TabPanels flex="1" overflow="hidden">
          <TabPanel h="100%" p={0}>
            <Flex h="100%">
              <Box flex={1} borderRight="1px" borderColor="gray.200" overflowY="auto">
                <TableList onSelectTable={setSelectedTable} />
              </Box>
              <Box flex={1} overflowY="auto">
                <TableDetails selectedTable={selectedTable} />
              </Box>
            </Flex>
          </TabPanel>
          <TabPanel h="100%" p={0}>
            <OrderTab selectedTable={selectedTable} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  );
}