"use client"
import React from 'react';
import { Box, SimpleGrid, Text, Button, Image, Heading, Flex } from '@chakra-ui/react';

interface Table {
  id: number;
  name: string;
  status: 'available' | 'occupied' | 'reserved';
  type: string;
}

interface MenuItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

interface OrderProps {
  selectedTable: Table | null;
  tableState: {
    orderItems: MenuItem[];
  };
  onAddItem: (tableId: number, item: MenuItem) => void;
}

const menuItems = [
  { id: 1, name: 'Mỳ', price: 50000, imageUrl: '/assets/noodle.jpg', quantity: 0 },
  { id: 2, name: 'Pizza', price: 100000, imageUrl: '/assets/pizza.jpg', quantity: 0 },
  { id: 3, name: 'Coca Cola', price: 15000, imageUrl: '/assets/coca.jpg', quantity: 0 },
  { id: 4, name: 'Iced Tea', price: 20000, imageUrl: '/assets/milktea.jpg', quantity: 0 },
];

const Order: React.FC<OrderProps> = ({ selectedTable, tableState, onAddItem }) => {
  if (!selectedTable) {
    return (
      <Box p={4}>
        <Text fontSize="xl" fontWeight="bold" color="gray.500">
          Vui lòng chọn bàn
        </Text>
      </Box>
    );
  }

  const statusColor = 
    selectedTable.status === 'available' ? 'green.500' :
    selectedTable.status === 'occupied' ? 'blue.500' : 
    'orange.500';

  const statusText = 
    selectedTable.status === 'available' ? 'Trống' :
    selectedTable.status === 'occupied' ? 'Đang hoạt động' :
    'Đã đặt trước';

  return (
    <Box p={4} h="100%" overflowY="auto">
      <Flex direction="column" minH="100%">
        <Box mb={6}>
          <Heading size="md" mb={2}>
            Gọi món cho {selectedTable.name}
          </Heading>
          <Text color={statusColor} fontWeight="medium">
            Trạng thái: {statusText}
          </Text>
          {selectedTable.status !== 'occupied' && (
            <Text color="gray.600" fontSize="sm">
              * Cần kích hoạt bàn để gọi món
            </Text>
          )}
        </Box>

        <SimpleGrid columns={3} spacing={4} flex="1">
          {menuItems.map((item) => {
            const existingItem = tableState.orderItems.find(i => i.id === item.id);
            
            return (
              <Box 
                key={item.id} 
                borderWidth={1} 
                borderRadius="lg" 
                p={4}
                bg="white"
                shadow="sm"
                _hover={{ shadow: 'md' }}
                transition="all 0.2s"
              >
                <Image 
                  src={item.imageUrl} 
                  alt={item.name} 
                  mb={3}
                  borderRadius="md"
                  height="160px"
                  width="100%"
                  objectFit="cover"
                />
                <Text fontWeight="bold" mb={1}>{item.name}</Text>
                <Text color="gray.600" mb={3}>{item.price.toLocaleString()}đ</Text>
                
                {existingItem && (
                  <Text mb={2} color="blue.500">
                    Đã chọn: {existingItem.quantity}
                  </Text>
                )}
                
                <Button
                  w="full"
                  colorScheme="blue"
                  onClick={() => onAddItem(selectedTable.id, item)}
                  size="sm"
                  isDisabled={selectedTable.status !== 'occupied'}
                  _hover={{ transform: selectedTable.status === 'occupied' ? 'translateY(-1px)' : 'none' }}
                >
                  Thêm món
                </Button>
              </Box>
            );
          })}
        </SimpleGrid>
      </Flex>
    </Box>
  );
};

export default Order;