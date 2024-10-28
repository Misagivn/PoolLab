"use client"
import React, { useState, useEffect } from 'react';
import { Box, VStack, HStack, Text, Button, Image, Flex, Heading, IconButton } from '@chakra-ui/react';
import { AddIcon, MinusIcon } from '@chakra-ui/icons';

interface TableDetailProps {
  selectedTable: Table | null;
  tableState: {
    orderItems: MenuItem[];
  };
  onUpdateQuantity: (tableId: number, itemId: number, change: number) => void;
  onPayment: (tableId: number) => void;
  onUpdateTableStatus: (tableId: number, status: string) => void;
}

const TableDetail: React.FC<TableDetailProps> = ({ 
  selectedTable, 
  tableState,
  onUpdateQuantity,
  onPayment,
  onUpdateTableStatus
}) => {
  const [timer, setTimer] = useState({
    isActive: false,
    startTime: 0,
    elapsedTime: 0
  });

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer.isActive) {
      interval = setInterval(() => {
        setTimer(prev => ({
          ...prev,
          elapsedTime: Math.floor((Date.now() - prev.startTime) / 1000)
        }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer.isActive, timer.startTime]);

  if (!selectedTable) {
    return (
      <Box p={4} h="100%" display="flex" alignItems="center" justifyContent="center">
        <Text>Vui lòng chọn một bàn để xem chi tiết</Text>
      </Box>
    );
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const calculateTimeCharge = () => {
    if (!timer.elapsedTime) return 0;
    const minutes = Math.ceil(timer.elapsedTime / 60);
    const halfHours = Math.ceil(minutes / 30);
    return halfHours * 25000; // 50,000đ/giờ = 25,000đ/30 phút
  };

  const handleActivate = () => {
    setTimer({
      isActive: true,
      startTime: Date.now(),
      elapsedTime: 0
    });
    onUpdateTableStatus(selectedTable.id, 'occupied');
  };

  const calculateTotal = () => {
    const itemsTotal = tableState.orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    return itemsTotal + calculateTimeCharge();
  };

  const handlePayment = () => {
    // Dừng timer và reset về trạng thái ban đầu
    setTimer({
      isActive: false,
      startTime: 0,
      elapsedTime: 0
    });
    // Chuyển trạng thái bàn về trống
    onUpdateTableStatus(selectedTable.id, 'available');
    // Gọi hàm thanh toán để xử lý các món đã gọi
    onPayment(selectedTable.id);
  };

  return (
    <Box p={4} h="100%" overflowY="auto">
      <VStack align="stretch" spacing={4}>
        <Flex align="center">
          <Image src={selectedTable.imageUrl} alt={selectedTable.name} boxSize="40px" mr={3} />
          <Box flex="1">
            <Heading size="md">{selectedTable.name}</Heading>
            <Text fontSize="sm">Trạng thái: {
              selectedTable.status === 'available' ? 'Trống' :
              selectedTable.status === 'occupied' ? 'Đang chơi' :
              'Đã đặt trước'
            }</Text>
            <Text fontSize="sm">Loại bàn: {selectedTable.type}</Text>
            {timer.isActive && (
              <Text fontSize="sm" color="green.500">Có thể gọi món</Text>
            )}
          </Box>
          {!timer.isActive ? (
            <Button 
              colorScheme="teal" 
              onClick={handleActivate}
              isDisabled={selectedTable.status !== 'available'}
            >
              Kích hoạt
            </Button>
          ) : (
            <Box textAlign="right">
              <Text fontWeight="bold" fontSize="xl">{formatTime(timer.elapsedTime)}</Text>
              <Text fontSize="sm">Phí thời gian: {calculateTimeCharge().toLocaleString()}đ</Text>
            </Box>
          )}
        </Flex>

        {timer.isActive && (
          <Box bg="blue.50" p={3} borderRadius="md">
            <Text fontWeight="bold">Thông tin tính giờ:</Text>
            <Text>Thời gian chơi: {formatTime(timer.elapsedTime)}</Text>
            <Text>Phí thời gian: {calculateTimeCharge().toLocaleString()}đ</Text>
          </Box>
        )}

        <Box>
          <Text fontWeight="bold" mb={2}>Món đã chọn</Text>
          {tableState.orderItems.length > 0 ? (
            <VStack align="stretch" spacing={2}>
              {tableState.orderItems.map(item => (
                <Flex key={item.id} justify="space-between" align="center" p={2} bg="gray.50" borderRadius="md">
                  <Text>{item.name}</Text>
                  <HStack>
                    <IconButton
                      size="xs"
                      icon={<MinusIcon />}
                      onClick={() => onUpdateQuantity(selectedTable.id, item.id, -1)}
                      aria-label="Giảm số lượng"
                    />
                    <Text>{item.quantity}</Text>
                    <IconButton
                      size="xs"
                      icon={<AddIcon />}
                      onClick={() => onUpdateQuantity(selectedTable.id, item.id, 1)}
                      aria-label="Tăng số lượng"
                    />
                    <Text>{(item.price * item.quantity).toLocaleString()}đ</Text>
                  </HStack>
                </Flex>
              ))}
            </VStack>
          ) : (
            <Text color="gray.500">Chưa có món nào được chọn</Text>
          )}
        </Box>

        <Box mt={4}>
          <Flex justify="space-between" align="center">
            <VStack align="start" spacing={0}>
              <Text>Phí thời gian: {calculateTimeCharge().toLocaleString()}đ</Text>
              <Text>Phí món ăn: {tableState.orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toLocaleString()}đ</Text>
              <Text fontWeight="bold" fontSize="lg">Tổng cộng: {calculateTotal().toLocaleString()}đ</Text>
            </VStack>
            <Button 
              colorScheme="blue" 
              onClick={handlePayment}
              isDisabled={!timer.isActive && tableState.orderItems.length === 0}
            >
              Thanh toán
            </Button>
          </Flex>
        </Box>
      </VStack>
    </Box>
  );
};

export default TableDetail;