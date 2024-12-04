"use client";

import { useState } from 'react';
import { 
  Box, 
  Grid, 
  Heading, 
  Spinner, 
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Stack,
  Text
} from '@chakra-ui/react';
import { useStores, useStore } from '@/hooks/useStores';
import { StoreCard } from '@/components/store/StoreCard';
import { Store } from '@/utils/types/store';

export default function StoreListPage() {
  const { data: stores, isLoading } = useStores();
  const [selectedStoreId, setSelectedStoreId] = useState<string>('');
  const { data: selectedStore } = useStore(selectedStoreId);
  const { isOpen, onOpen, onClose } = useDisclosure();

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Spinner size="xl" />
      </Box>
    );
  }

  return (
    <Box p={8}>
      <Heading mb={6}>Store Management</Heading>
      <Grid 
        templateColumns={['1fr', '1fr 1fr', 'repeat(3, 1fr)']} 
        gap={6}
      >
        {stores?.map((store: Store) => (
          <StoreCard 
            key={store.id} 
            store={store}
            onClick={() => {
              setSelectedStoreId(store.id);
              onOpen();
            }}
          />
        ))}
      </Grid>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedStore?.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Stack spacing={4}>
              <Text><strong>Address:</strong> {selectedStore?.address}</Text>
              <Text><strong>Description:</strong> {selectedStore?.descript}</Text>
              <Text><strong>Phone:</strong> {selectedStore?.phoneNumber}</Text>
              <Text><strong>Rating:</strong> {selectedStore?.rated}/5</Text>
              <Text><strong>Status:</strong> {selectedStore?.status}</Text>
              <Text><strong>Created:</strong> {new Date(selectedStore?.createdDate || '').toLocaleDateString()}</Text>
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}