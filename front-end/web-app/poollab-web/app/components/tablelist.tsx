// File: /app/components/tablelist.tsx
'use client';
import React, { useState } from 'react';
import { Box, Image, Text, SimpleGrid, VStack, Button, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, FormControl, FormLabel, Input, Select } from '@chakra-ui/react';
import { Table } from '../table/page';

interface TableListProps {
  onConfirmTable: (table: Table) => void;
}

const initialTables: Table[] = [
  { id: 1, name: 'Bàn 1', status: 'available', imageUrl: '/pool-table (1).png' },
  { id: 2, name: 'Bàn 2', status: 'occupied', imageUrl: '/pool-table (1).png' },
  { id: 3, name: 'Bàn 3', status: 'reserved', imageUrl: '/pool-table (1).png' },
  { id: 4, name: 'Bàn 4', status: 'maintenance', imageUrl: '/pool-table (1).png' },
];

export default function TableList({ onConfirmTable }: TableListProps) {
  const [tables, setTables] = useState<Table[]>(initialTables);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newTableName, setNewTableName] = useState('');
  const [newTableStatus, setNewTableStatus] = useState<Table['status']>('available');
  
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const { isOpen: isConfirmOpen, onOpen: onConfirmOpen, onClose: onConfirmClose } = useDisclosure();

  const handleCreateTable = () => {
    if (newTableName.trim() === '') return;
    const newTable: Table = {
      id: tables.length + 1,
      name: newTableName,
      status: newTableStatus,
      imageUrl: '/pool-table (1).png'
    };
    setTables([...tables, newTable]);
    setNewTableName('');
    setNewTableStatus('available');
    onClose();
  };

  const handleSelectTable = (table: Table) => {
    setSelectedTable(table);
    onConfirmOpen();
  };

  const handleConfirm = () => {
    if (selectedTable) {
      onConfirmTable(selectedTable);
    }
    onConfirmClose();
  };

  const getStatusColor = (status: Table['status']) => {
    switch (status) {
      case 'available': return 'green.500';
      case 'occupied': return 'red.500';
      case 'reserved': return 'orange.500';
      case 'maintenance': return 'yellow.500';
    }
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
    <Box w="70%" p={4} bg="gray.100" overflowY="auto" maxH="100vh">
      <Button colorScheme="teal" mb={4} onClick={onOpen}>Tạo mới bàn</Button>
      <SimpleGrid columns={3} spacing={4}>
        {tables.map((table) => (
          <VStack
            key={table.id}
            bg="white"
            p={4}
            borderRadius="md"
            boxShadow="md"
            onClick={() => handleSelectTable(table)}
            cursor="pointer"
            _hover={{ boxShadow: 'lg' }}
          >
            <Image src={table.imageUrl} alt={table.name} borderRadius="md" />
            <Text fontWeight="bold">{table.name}</Text>
            <Text color={getStatusColor(table.status)}>
              {getStatusText(table.status)}
            </Text>
          </VStack>
        ))}
      </SimpleGrid>

      {/* Modal tạo bàn mới */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Tạo mới bàn</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Tên bàn</FormLabel>
              <Input 
                value={newTableName} 
                onChange={(e) => setNewTableName(e.target.value)}
                placeholder="Nhập tên bàn"
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Trạng thái</FormLabel>
              <Select 
                value={newTableStatus}
                onChange={(e) => setNewTableStatus(e.target.value as Table['status'])}
              >
                <option value="available">Trống</option>
                <option value="occupied">Đã đặt</option>
                <option value="reserved">Đã đặt trước</option>
                <option value="maintenance">Đang sửa chữa</option>
              </Select>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleCreateTable}>
              Tạo
            </Button>
            <Button variant="ghost" onClick={onClose}>Hủy</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal xác nhận chọn bàn */}
      <Modal isOpen={isConfirmOpen} onClose={onConfirmClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedTable?.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Trạng thái: {getStatusText(selectedTable?.status || 'available')}</Text>
            <Text mt={2}>Bạn có muốn chọn bàn này không?</Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleConfirm}>
              Xác nhận
            </Button>
            <Button variant="ghost" onClick={onConfirmClose}>Hủy</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}