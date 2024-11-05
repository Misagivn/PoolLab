// File: /app/table/page.tsx
"use client"
import React, { useState } from 'react';
import { Flex, Box, Tabs, TabList, Tab, TabPanels, TabPanel } from '@chakra-ui/react';
import TableList from '../components/staff/tablelist';
import Order from '../components/staff/order';
import TableDetail from '../components/staff/tabledetail';

interface TableState {
  orderItems: MenuItem[];
  isActive: boolean;
  startTime: number;
  elapsedTime: number;
}

const TablePage = () => {
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [tableStates, setTableStates] = useState<Record<number, TableState>>({});
  const [activeTab, setActiveTab] = useState(0);

  const currentTableState = selectedTable 
    ? tableStates[selectedTable.id] || { orderItems: [], isActive: false, startTime: 0, elapsedTime: 0 }
    : { orderItems: [], isActive: false, startTime: 0, elapsedTime: 0 };

  const handleAddOrderItem = (tableId: number, item: MenuItem) => {
    setTableStates(prev => {
      const currentState = prev[tableId] || { orderItems: [], isActive: false, startTime: 0, elapsedTime: 0 };
      const existingItem = currentState.orderItems.find(i => i.id === item.id);
      
      return {
        ...prev,
        [tableId]: {
          ...currentState,
          orderItems: existingItem
            ? currentState.orderItems.map(i =>
                i.id === item.id
                  ? { ...i, quantity: i.quantity + 1 }
                  : i
              )
            : [...currentState.orderItems, { ...item, quantity: 1 }]
        }
      };
    });
  };

  const handleUpdateTableStatus = (tableId: number, status: string) => {
    setSelectedTable(prev => prev ? { ...prev, status } : null);
  };

  // Activate table and start the timer for the specific table
  const handleActivateTable = (tableId: number) => {
    setTableStates(prev => ({
      ...prev,
      [tableId]: {
        ...prev[tableId],
        isActive: true,
        startTime: Date.now(),
        elapsedTime: 0
      }
    }));
    setSelectedTable({ ...selectedTable, status: 'occupied' });
  };

  // Update quantity and remove item if quantity is zero
  const handleUpdateQuantity = (tableId: number, itemId: number, change: number) => {
    setTableStates(prev => {
      const currentState = prev[tableId];
      const updatedItems = currentState.orderItems
        .map(item => item.id === itemId ? { ...item, quantity: item.quantity + change } : item)
        .filter(item => item.quantity > 0); // Remove items with quantity 0

      return {
        ...prev,
        [tableId]: {
          ...currentState,
          orderItems: updatedItems
        }
      };
    });
  };

  const handlePayment = (tableId: number) => {
    setTableStates(prev => ({
      ...prev,
      [tableId]: {
        ...prev[tableId],
        orderItems: [],
        isActive: false,
        startTime: 0,
        elapsedTime: 0
      }
    }));
  };

  return (
    <Flex h="100%" w="100%">
      <Flex flex={2} flexDirection="column">
        <Tabs size="md" variant="enclosed" flex={1} display="flex" flexDirection="column">
          <TabList>
            <Tab>Table</Tab>
            <Tab>Order</Tab>
          </TabList>
          <TabPanels flex={1} overflow="hidden">
            <TabPanel h="100%" p={0}>
              <TableList onSelectTable={setSelectedTable} />
            </TabPanel>
            <TabPanel h="100%" p={0}>
              <Order 
                selectedTable={selectedTable}
                tableState={currentTableState}
                onAddItem={handleAddOrderItem}
              />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Flex>
      <Box flex={1} borderLeft="1px" borderColor="gray.200">
        <TableDetail 
          selectedTable={selectedTable}
          tableState={currentTableState}
          onUpdateQuantity={handleUpdateQuantity}
          onPayment={handlePayment}
          onActivateTable={handleActivateTable}
          onUpdateTableStatus={handleUpdateTableStatus}
        />
      </Box>
    </Flex>
  );
};

export default TablePage;
