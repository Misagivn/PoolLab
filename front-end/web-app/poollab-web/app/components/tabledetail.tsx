// File: /app/components/tabledetail.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { Box, Heading, Button, Grid, Alert, AlertIcon, VStack, Text } from '@chakra-ui/react';
import { Table } from '../table/page';

interface Drink {
  id: number;
  name: string;
  price: number;
}

interface TableDetailsProps {
  selectedTable: Table | null;
}

const drinks: Drink[] = [
  { id: 1, name: 'Coca Cola', price: 15000 },
  { id: 2, name: 'Pepsi', price: 15000 },
  { id: 3, name: 'Bia', price: 20000 },
];

export default function TableDetails({ selectedTable }: TableDetailsProps) {
  const [timer, setTimer] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [selectedDrinks, setSelectedDrinks] = useState<Drink[]>([]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const toggleTimer = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  const addDrink = (drink: Drink) => {
    setSelectedDrinks([...selectedDrinks, drink]);
  };

  const getStatusText = (status: Table['status']) => {
    switch (status) {
      case 'available': return 'Trống';
      case 'occupied': return 'Đã đặt';
      case 'reserved': return 'Đã đặt trước';
      case 'maintenance': return 'Đang sửa chữa';
    }
  };

  return (
    <Box w="30%" p={4} bg="white" overflowY="auto" maxH="100vh">
      {selectedTable ? (
        <>
          <Heading as="h2" size="xl" mb={4}>{selectedTable.name}</Heading>
          <Text mb={2}>Trạng thái: {getStatusText(selectedTable.status)}</Text>
          <Box mb={4}>
            <Text fontSize="xl">
              Thời gian: {Math.floor(timer / 60)}:{timer % 60 < 10 ? '0' : ''}{timer % 60}
            </Text>
            <Button onClick={toggleTimer} mt={2} colorScheme="teal" isDisabled={selectedTable.status === 'maintenance'}>
              {isTimerRunning ? 'Dừng' : 'Bắt đầu'}
            </Button>
          </Box>
          <Box mb={4}>
            <Heading as="h3" size="lg" mb={2}>Đồ uống</Heading>
            <Grid templateColumns="repeat(2, 1fr)" gap={2}>
              {drinks.map((drink) => (
                <Button key={drink.id} onClick={() => addDrink(drink)} variant="outline" isDisabled={selectedTable.status === 'maintenance'}>
                  {drink.name} - {drink.price}đ
                </Button>
              ))}
            </Grid>
          </Box>
          {selectedDrinks.length > 0 && (
            <Box>
              <Heading as="h3" size="lg" mb={2}>Đồ uống đã chọn</Heading>
              <VStack align="start">
                {selectedDrinks.map((drink, index) => (
                  <Text key={index}>{drink.name} - {drink.price}đ</Text>
                ))}
              </VStack>
            </Box>
          )}
        </>
      ) : (
        <Alert status="info">
          <AlertIcon />
          <Text>Vui lòng chọn một bàn từ danh sách bên trái để xem thông tin và quản lý.</Text>
        </Alert>
      )}
    </Box>
  );
}