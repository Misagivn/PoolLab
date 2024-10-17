// File: /app/table/components/TableDetails.tsx
'use client';
import React, { useState } from 'react';
import { Box, Heading, Button, Grid, Alert, AlertIcon, VStack, Text } from '@chakra-ui/react';

interface Drink {
  id: number;
  name: string;
  price: number;
}

interface Table {
  id: number;
  name: string;
}

const drinks: Drink[] = [
  { id: 1, name: 'Coca Cola', price: 15000 },
  { id: 2, name: 'Pepsi', price: 15000 },
  { id: 3, name: 'Bia', price: 20000 },
  // Thêm các đồ uống khác ở đây
];

export default function TableDetails() {
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [timer, setTimer] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [selectedDrinks, setSelectedDrinks] = useState<Drink[]>([]);

  const toggleTimer = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  const addDrink = (drink: Drink) => {
    setSelectedDrinks([...selectedDrinks, drink]);
  };

  return (
    <Box w="50%" p={4} bg="white" overflowY="auto">
      {selectedTable ? (
        <>
          <Heading as="h2" size="xl" mb={4}>{selectedTable.name}</Heading>
          <Box mb={4}>
            <Text fontSize="xl">
              Thời gian: {Math.floor(timer / 60)}:{timer % 60 < 10 ? '0' : ''}{timer % 60}
            </Text>
            <Button onClick={toggleTimer} mt={2} colorScheme="teal">
              {isTimerRunning ? 'Dừng' : 'Bắt đầu'}
            </Button>
          </Box>
          <Box mb={4}>
            <Heading as="h3" size="lg" mb={2}>Đồ uống</Heading>
            <Grid templateColumns="repeat(2, 1fr)" gap={2}>
              {drinks.map((drink) => (
                <Button key={drink.id} onClick={() => addDrink(drink)} variant="outline">
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
