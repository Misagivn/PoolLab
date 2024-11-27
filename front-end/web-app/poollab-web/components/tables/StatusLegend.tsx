import { HStack, Badge, Text } from '@chakra-ui/react';

export const StatusLegend = () => (
  <HStack spacing={4} bg="white" p={4} borderRadius="lg" flexWrap="wrap">
    <HStack>
      <Badge colorScheme="green">BÀN TRỐNG</Badge>
      <Text fontSize="sm">Sẵn sàng</Text>
    </HStack>
    <HStack>
      <Badge colorScheme="red">ĐANG SỬ DỤNG</Badge>
      <Text fontSize="sm">Có khách</Text>
    </HStack>
    <HStack>
      <Badge colorScheme="yellow">ĐANG BẢO TRÌ</Badge>
      <Text fontSize="sm">Bảo trì</Text>
    </HStack>
  </HStack>
);