import { Box, Image, Text, Badge, Stack, useColorModeValue } from '@chakra-ui/react';
import { Store } from '@/utils/types/store';

interface StoreCardProps {
  store: Store;
  onClick?: () => void;
}

export const StoreCard = ({ store, onClick }: StoreCardProps) => {
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box 
      borderWidth="1px" 
      borderRadius="lg" 
      borderColor={borderColor}
      overflow="hidden"
      cursor="pointer"
      onClick={onClick}
      _hover={{ shadow: 'md' }}
    >
      <Image src={store.storeImg} alt={store.name} height="200px" width="100%" objectFit="cover" />
      <Stack p={4} spacing={2}>
        <Text fontSize="xl" fontWeight="bold">{store.name}</Text>
        <Text color="gray.600">{store.address}</Text>
        <Badge colorScheme={store.status === 'Đang hoạt động' ? 'green' : 'red'}>
          {store.status}
        </Badge>
        <Text fontSize="sm">Rated: {store.rated}/5</Text>
      </Stack>
    </Box>
  );
};