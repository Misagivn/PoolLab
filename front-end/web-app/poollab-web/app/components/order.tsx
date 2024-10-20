import React, { useState, useMemo } from 'react';
import {
  Box,
  Flex,
  VStack,
  Text,
  Button,
  Input,
  SimpleGrid,
  Image,
  HStack,
  Select,
} from '@chakra-ui/react';
import { Table } from '../(staff)/booktable/page';

interface MenuItem {
  id: number;
  name: string;
  type: 'food' | 'drink';
  price: number;
  imageUrl: string;
}

const menuItems: MenuItem[] = [
  { id: 1, name: 'Mỳ', type: 'food', price: 50000, imageUrl: '/noodle.jpg' },
  { id: 2, name: 'Pizza', type: 'food', price: 100000, imageUrl: '/pizza.jpg' },
  { id: 3, name: 'Coca Cola', type: 'drink', price: 15000, imageUrl: '/coca.jpg' },
  { id: 4, name: 'Iced Tea', type: 'drink', price: 20000, imageUrl: '/milktea.jpg' },
  // Add more items as needed
];

interface OrderTabProps {
  selectedTable: Table | null;
}

export default function OrderTab({ selectedTable }: OrderTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'food' | 'drink'>('all');
  const [orderItems, setOrderItems] = useState<Array<MenuItem & { quantity: number }>>([]);

  const filteredItems = useMemo(() => 
    menuItems.filter(item => 
      (filterType === 'all' || item.type === filterType) &&
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    [searchTerm, filterType]
  );

  const addToOrder = (item: MenuItem) => {
    setOrderItems(prev => {
      const existingItem = prev.find(i => i.id === item.id);
      if (existingItem) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      } else {
        return [...prev, { ...item, quantity: 1 }];
      }
    });
  };

  const updateQuantity = (id: number, change: number) => {
    setOrderItems(prev => 
      prev.map(item => 
        item.id === id 
          ? { ...item, quantity: Math.max(0, item.quantity + change) }
          : item
      ).filter(item => item.quantity > 0)
    );
  };

  const calculateTotal = () => 
    orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handlePayment = () => {
    console.log('Processing payment for:', orderItems);
    setOrderItems([]);
  };

  return (
    <Flex h="100%">
      <Box flex={1} borderRight="1px" borderColor="gray.200" p={4}>
        <VStack spacing={4} align="stretch">
          <HStack>
            <Input
              placeholder="Tìm kiếm món..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as 'all' | 'food' | 'drink')}
            >
              <option value="all">Tất cả</option>
              <option value="food">Đồ ăn</option>
              <option value="drink">Đồ uống</option>
            </Select>
          </HStack>
          <SimpleGrid columns={3} spacing={4} overflowY="auto">
            {filteredItems.map((item) => (
              <Box key={item.id} borderWidth={1} borderRadius="lg" p={4}>
                <Image src={item.imageUrl} alt={item.name} mb={2} />
                <Text fontWeight="bold">{item.name}</Text>
                <Text>{item.price.toLocaleString()}đ</Text>
                <Button mt={2} size="sm" onClick={() => addToOrder(item)}>Thêm</Button>
              </Box>
            ))}
          </SimpleGrid>
        </VStack>
      </Box>
      <Box flex={1} p={4}>
        <VStack align="stretch" spacing={4}>
          <Text fontSize="xl" fontWeight="bold">Bàn: {selectedTable?.name || 'Chưa chọn'}</Text>
          <VStack align="stretch" spacing={2}>
            {orderItems.map(item => (
              <HStack key={item.id} justify="space-between">
                <Text>{item.name}</Text>
                <HStack>
                  <Button size="xs" onClick={() => updateQuantity(item.id, -1)}>-</Button>
                  <Text>{item.quantity}</Text>
                  <Button size="xs" onClick={() => updateQuantity(item.id, 1)}>+</Button>
                  <Text>{(item.price * item.quantity).toLocaleString()}đ</Text>
                </HStack>
              </HStack>
            ))}
          </VStack>
          <HStack justify="space-between" fontWeight="bold">
            <Text>Tổng cộng:</Text>
            <Text>{calculateTotal().toLocaleString()}đ</Text>
          </HStack>
          <Button colorScheme="blue" onClick={handlePayment}>Thanh toán</Button>
        </VStack>
      </Box>
    </Flex>
  );
}