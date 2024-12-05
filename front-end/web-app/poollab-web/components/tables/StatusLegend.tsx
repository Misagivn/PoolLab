import { HStack, Badge, Text } from '@chakra-ui/react';

export const StatusLegend = () => (
  <HStack spacing={4} bg="white" p={4} borderRadius="lg" flexWrap="wrap">
    <HStack>
      <Badge colorScheme="green">Bàn Trống</Badge>
      <Text fontSize="sm">Sẵn sàng</Text>
    </HStack>
    <HStack>
      <Badge colorScheme="red">Có Khách</Badge>
      <Text fontSize="sm">Bàn đang sử dụng</Text>
    </HStack>
    <HStack>
      <Badge colorScheme="blue">Đã Đặt</Badge>
      <Text fontSize="sm">Đã đặt</Text>
    </HStack>
  </HStack>
);