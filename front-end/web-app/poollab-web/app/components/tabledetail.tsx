import React, { useState, useEffect } from 'react';
import { Box, Heading, Button, VStack, Text, Flex, Image, SimpleGrid, HStack, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Table, Thead, Tbody, Tr, Th, Td, IconButton } from '@chakra-ui/react';
import { AddIcon, MinusIcon } from '@chakra-ui/icons';

interface Table {
  id: number;
  name: string;
  status: 'available' | 'occupied' | 'reserved' | 'maintenance';
  imageUrl: string;
  member?: string;
  startTime?: number;
  elapsedTime: number;
}

interface TableDetailsProps {
  selectedTable: Table | null;
  onUpdateTableStatus: (tableId: number, newStatus: Table['status'], startTime?: number) => void;
  onUpdateElapsedTime: (tableId: number, elapsedTime: number) => void;
}

interface Drink {
  id: number;
  name: string;
  price: number;
}

const drinks: Drink[] = [
  { id: 1, name: 'Coca Cola', price: 15000 },
  { id: 2, name: 'Pepsi', price: 15000 },
  { id: 3, name: 'Bia', price: 20000 },
];

export default function TableDetails({ selectedTable, onUpdateTableStatus, onUpdateElapsedTime }: TableDetailsProps) {
  const [selectedDrinks, setSelectedDrinks] = useState<{ drink: Drink; quantity: number }[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isInvoiceOpen, onOpen: onInvoiceOpen, onClose: onInvoiceClose } = useDisclosure();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (selectedTable && selectedTable.status === 'occupied') {
      interval = setInterval(() => {
        const newElapsedTime = selectedTable.elapsedTime + 1;
        onUpdateElapsedTime(selectedTable.id, newElapsedTime);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [selectedTable, onUpdateElapsedTime]);

  const handleActivateTable = () => {
    if (selectedTable?.status === 'available') {
      onOpen();
    }
  };

  const confirmActivation = () => {
    if (selectedTable) {
      const startTime = Date.now();
      onUpdateTableStatus(selectedTable.id, 'occupied', startTime);
      onUpdateElapsedTime(selectedTable.id, 0);
      onClose();
    }
  };

  const handleStopTable = () => {
    if (selectedTable) {
      onInvoiceOpen();
    }
  };

  const handlePayment = () => {
    if (selectedTable) {
      onUpdateTableStatus(selectedTable.id, 'available');
      onUpdateElapsedTime(selectedTable.id, 0);
      setSelectedDrinks([]);
      onInvoiceClose();
    }
  };

  const formatTime = (seconds: number) => {
    if (seconds === 0 && selectedTable?.status !== 'occupied') {
      return 'NaN:NaN:NaN';
    }
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleAddDrink = (drink: Drink) => {
    const existingDrink = selectedDrinks.find(item => item.drink.id === drink.id);
    if (existingDrink) {
      setSelectedDrinks(selectedDrinks.map(item =>
        item.drink.id === drink.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setSelectedDrinks([...selectedDrinks, { drink, quantity: 1 }]);
    }
  };

  const handleRemoveDrink = (drink: Drink) => {
    const existingDrink = selectedDrinks.find(item => item.drink.id === drink.id);
    if (existingDrink) {
      if (existingDrink.quantity > 1) {
        setSelectedDrinks(selectedDrinks.map(item =>
          item.drink.id === drink.id ? { ...item, quantity: item.quantity - 1 } : item
        ));
      } else {
        setSelectedDrinks(selectedDrinks.filter(item => item.drink.id !== drink.id));
      }
    }
  };

  const calculateTotal = () => {
    const drinkTotal = selectedDrinks.reduce((acc, item) => acc + item.drink.price * item.quantity, 0);
    const tableRate = 50000; // Assuming a fixed rate per hour
    const tableTotal = Math.ceil(selectedTable!.elapsedTime / 3600) * tableRate;
    return drinkTotal + tableTotal;
  };

  if (!selectedTable) {
    return (
      <Box p={4} h="100%" display="flex" alignItems="center" justifyContent="center">
        <Text>Vui lòng chọn một bàn để xem chi tiết.</Text>
      </Box>
    );
  }

  return (
    <Box p={4} h="100%" overflowY="auto">
      <Flex alignItems="center" mb={4}>
        <Image src={selectedTable.imageUrl} alt={selectedTable.name} boxSize="40px" mr={3} />
        <Box>
          <Heading as="h2" size="md">{selectedTable.name}</Heading>
          <Text fontSize="sm">Trạng thái: {
            selectedTable.status === 'available' ? 'Trống' :
            selectedTable.status === 'occupied' ? 'Đang chơi' :
            selectedTable.status === 'reserved' ? 'Đã đặt trước' : 'Đang sửa chữa'
          }</Text>
          {selectedTable.member && <Text fontSize="sm">Member: {selectedTable.member}</Text>}
        </Box>
      </Flex>
      
      <HStack mb={4} spacing={4}>
        <Text fontSize="sm" fontWeight="bold">
          Thời gian chơi: {formatTime(selectedTable.elapsedTime)}
        </Text>
        {selectedTable.status === 'available' ? (
          <Button 
            onClick={handleActivateTable} 
            size="sm" 
            colorScheme="teal"
          >
            Kích hoạt
          </Button>
        ) : selectedTable.status === 'occupied' ? (
          <Button 
            onClick={handleStopTable} 
            size="sm" 
            colorScheme="red"
          >
            Thanh toán
          </Button>
        ) : null}
      </HStack>

      <Box mb={4}>
        <Heading as="h3" size="sm" mb={2}>Đồ uống</Heading>
        <SimpleGrid columns={2} spacing={2}>
          {drinks.map((drink) => (
            <Flex key={drink.id} justifyContent="space-between" w="100%" p={2} bg="gray.100" borderRadius="md" fontSize="sm">
              <Text>{drink.name}</Text>
              <HStack>
                <Text>{drink.price}đ</Text>
                <IconButton
                  aria-label="Add drink"
                  icon={<AddIcon />}
                  size="xs"
                  onClick={() => handleAddDrink(drink)}
                />
              </HStack>
            </Flex>
          ))}
        </SimpleGrid>
      </Box>

      <Box>
        <Heading as="h3" size="sm" mb={2}>Đồ uống đã chọn</Heading>
        <VStack align="start" spacing={2}>
          {selectedDrinks.map((item, index) => (
            <Flex key={index} justifyContent="space-between" w="100%" fontSize="sm">
              <Text>{item.drink.name} x{item.quantity}</Text>
              <HStack>
                <Text>{item.drink.price * item.quantity}đ</Text>
                <IconButton
                  aria-label="Remove drink"
                  icon={<MinusIcon />}
                  size="xs"
                  onClick={() => handleRemoveDrink(item.drink)}
                />
              </HStack>
            </Flex>
          ))}
        </VStack>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Xác nhận kích hoạt bàn</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Bạn có chắc chắn muốn kích hoạt {selectedTable.name}?
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={confirmActivation}>
              Xác nhận
            </Button>
            <Button variant="ghost" onClick={onClose}>Hủy</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isInvoiceOpen} onClose={onInvoiceClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Hóa đơn - {selectedTable.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Mục</Th>
                  <Th isNumeric>Số lượng</Th>
                  <Th isNumeric>Đơn giá</Th>
                  <Th isNumeric>Thành tiền</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td>Thời gian chơi</Td>
                  <Td isNumeric>{Math.ceil(selectedTable.elapsedTime / 3600)} giờ</Td>
                  <Td isNumeric>50,000đ/giờ</Td>
                  <Td isNumeric>{Math.ceil(selectedTable.elapsedTime / 3600) * 50000}đ</Td>
                </Tr>
                {selectedDrinks.map((item, index) => (
                  <Tr key={index}>
                    <Td>{item.drink.name}</Td>
                    <Td isNumeric>{item.quantity}</Td>
                    <Td isNumeric>{item.drink.price}đ</Td>
                    <Td isNumeric>{item.drink.price * item.quantity}đ</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
            <Flex justifyContent="flex-end" mt={4}>
              <Text fontWeight="bold">Tổng cộng: {calculateTotal()}đ</Text>
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handlePayment}>
              Xác nhận thanh toán
            </Button>
            <Button variant="ghost" onClick={onInvoiceClose}>Hủy</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}