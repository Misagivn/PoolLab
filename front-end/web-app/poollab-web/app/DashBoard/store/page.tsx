
'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  SimpleGrid,
  Box,
  Image,
  Text,
  Badge,
  VStack,
  Input,
  Spinner,
  useToast,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useDisclosure,
  HStack
} from '@chakra-ui/react';

interface Store {
  id: string;
  name: string;
  address: string;
  storeImg: string;
  descript: string;
  phoneNumber: string;
  rated: number;
  timeStart: string | null;
  timeEnd: string | null;
  companyId: string | null;
  createdDate: string;
  updatedDate: string | null;
  status: string;
}

interface Time {
  hour: number;
  minute: number;
}

interface NewStore {
  name: string;
  address: string;
  storeImg: string;
  descript: string;
  phoneNumber: string;
  timeStart: null;
  timeEnd: null;
}

export default function StoresPage() {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const [newStore, setNewStore] = useState<NewStore>({
    name: '',
    address: '',
    storeImg: '',
    descript: '',
    phoneNumber: '',
    timeStart: { hour: 0, minute: 0 },
    timeEnd: { hour: 0, minute: 0 }
  });

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      const response = await axios.get('https://poollabwebapi20241008201316.azurewebsites.net/api/Store/GetAllStore');
      setStores(response.data.data);
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Không thể tải danh sách cửa hàng',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      await axios.post('https://poollabwebapi20241008201316.azurewebsites.net/api/Store/AddNewStore', newStore);
      toast({
        title: 'Thành công',
        description: 'Đã thêm cửa hàng mới',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onClose();
      fetchStores(); // Refresh danh sách
      // Reset form
      setNewStore({
        name: '',
        address: '',
        storeImg: '',
        descript: '',
        phoneNumber: '',
        timeStart: { hour: 0, minute: 0 },
        timeEnd: { hour: 0, minute: 0 }
      });
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Không thể thêm cửa hàng',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const filteredStores = stores.filter(store =>
    store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    store.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container maxW="container.xl" py={8}>
      <HStack mb={6} justify="space-between">
        <Input
          placeholder="Tìm kiếm cửa hàng..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          width="auto"
          flex={1}
        />
        <Button colorScheme="blue" onClick={onOpen}>
          Thêm cửa hàng mới
        </Button>
      </HStack>

      {/* Modal thêm cửa hàng mới */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Thêm cửa hàng mới</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>Tên cửa hàng</FormLabel>
                <Input
                  value={newStore.name}
                  onChange={(e) => setNewStore({...newStore, name: e.target.value})}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Địa chỉ</FormLabel>
                <Input
                  value={newStore.address}
                  onChange={(e) => setNewStore({...newStore, address: e.target.value})}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Link ảnh</FormLabel>
                <Input
                  value={newStore.storeImg}
                  onChange={(e) => setNewStore({...newStore, storeImg: e.target.value})}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Mô tả</FormLabel>
                <Input
                  value={newStore.descript}
                  onChange={(e) => setNewStore({...newStore, descript: e.target.value})}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Số điện thoại</FormLabel>
                <Input
                  value={newStore.phoneNumber}
                  onChange={(e) => setNewStore({...newStore, phoneNumber: e.target.value})}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Giờ mở cửa</FormLabel>
                <HStack>
                  <NumberInput
                    max={23}
                    min={0}
                    value={newStore.timeStart.hour}
                    onChange={(value) => setNewStore({
                      ...newStore,
                      timeStart: { ...newStore.timeStart, hour: parseInt(value) }
                    })}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                  <Text>:</Text>
                  <NumberInput
                    max={59}
                    min={0}
                    value={newStore.timeStart.minute}
                    onChange={(value) => setNewStore({
                      ...newStore,
                      timeStart: { ...newStore.timeStart, minute: parseInt(value) }
                    })}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </HStack>
              </FormControl>

              <FormControl>
                <FormLabel>Giờ đóng cửa</FormLabel>
                <HStack>
                  <NumberInput
                    max={23}
                    min={0}
                    value={newStore.timeEnd.hour}
                    onChange={(value) => setNewStore({
                      ...newStore,
                      timeEnd: { ...newStore.timeEnd, hour: parseInt(value) }
                    })}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                  <Text>:</Text>
                  <NumberInput
                    max={59}
                    min={0}
                    value={newStore.timeEnd.minute}
                    onChange={(value) => setNewStore({
                      ...newStore,
                      timeEnd: { ...newStore.timeEnd, minute: parseInt(value) }
                    })}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </HStack>
              </FormControl>

              <Button colorScheme="blue" width="full" mt={4} onClick={handleSubmit}>
                Thêm cửa hàng
              </Button>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Danh sách cửa hàng */}
      {loading ? (
        <Box textAlign="center">
          <Spinner size="xl" />
        </Box>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {filteredStores.map((store) => (
            <Box
              key={store.id}
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
              boxShadow="md"
            >
              <Image
                src={store.storeImg !== 'string' ? store.storeImg : '/placeholder.jpg'}
                alt={store.name}
                height="200px"
                width="100%"
                objectFit="cover"
                fallbackSrc="/placeholder.jpg"
              />

              <VStack p={4} align="stretch" spacing={2}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Text fontSize="xl" fontWeight="bold">{store.name}</Text>
                  <Badge colorScheme={store.status === 'Đang hoạt động' ? 'green' : 'red'}>
                    {store.status}
                  </Badge>
                </Box>

                <Text color="gray.600">{store.address}</Text>
                <Text color="gray.600">SĐT: {store.phoneNumber}</Text>
                <Text color="gray.500" fontSize="sm">
                  Đánh giá: {store.rated}/5
                </Text>
                {store.descript && (
                  <Text color="gray.600" fontSize="sm">
                    {store.descript}
                  </Text>
                )}
              </VStack>
            </Box>
          ))}
        </SimpleGrid>
      )}
    </Container>
  );
}