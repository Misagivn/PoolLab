// page.tsx
"use client";

import { useState } from 'react';
import {
  Box,
  Input,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  HStack,
  InputGroup,
  InputLeftElement,
  IconButton,
  Heading,
} from '@chakra-ui/react';
import { Search, RefreshCw, Eye, Edit, Trash } from 'lucide-react';
import { useStores } from '@/hooks/useStores';
import { StoreForm } from '@/components/store/StoreForm';
import { Store } from '@/utils/types/store';

export default function StoreListPage() {
  const { data: stores, isLoading } = useStores();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const { isOpen: isFormOpen, onOpen: onFormOpen, onClose: onFormClose } = useDisclosure();
  const { isOpen: isDetailOpen, onOpen: onDetailOpen, onClose: onDetailClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();

  const filteredStores = stores?.filter(store => 
    store.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box p={6}>
      <HStack mb={6} justify="space-between">
        <Heading size="lg">Quản lý cửa hàng</Heading>
        <Button colorScheme="blue" leftIcon={<span>+</span>}>
          Thêm cửa hàng
        </Button>
      </HStack>

      <HStack mb={6} spacing={4}>
        <InputGroup maxW="400px">
          <InputLeftElement>
            <Search size={20} />
          </InputLeftElement>
          <Input
            placeholder="Tìm kiếm cửa hàng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>
        <IconButton
          aria-label="Refresh"
          icon={<RefreshCw size={20} />}
          onClick={() => window.location.reload()}
        />
      </HStack>

      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>TÊN CỬA HÀNG</Th>
            <Th>MÔ TẢ</Th>
            <Th>THAO TÁC</Th>
          </Tr>
        </Thead>
        <Tbody>
          {filteredStores?.map((store: Store) => (
            <Tr key={store.id}>
              <Td>
                <HStack>
                  <Box as="span" color="blue.500">◎</Box>
                  {store.name}
                </HStack>
              </Td>
              <Td>{store.descript || 'Chưa có mô tả'}</Td>
              <Td>
                <HStack spacing={2}>
                  <IconButton
                    aria-label="View details"
                    icon={<Eye size={18} />}
                    variant="ghost"
                    onClick={() => {
                      setSelectedStore(store);
                      onDetailOpen();
                    }}
                  />
                  <IconButton
                    aria-label="Edit"
                    icon={<Edit size={18} />}
                    variant="ghost"
                    onClick={() => {
                      setSelectedStore(store);
                      onFormOpen();
                    }}
                  />
                  <IconButton
                    aria-label="Delete"
                    icon={<Trash size={18} />}
                    variant="ghost"
                    colorScheme="red"
                    onClick={() => {
                      setSelectedStore(store);
                      onDeleteOpen();
                    }}
                  />
                </HStack>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      {/* Store Detail Modal */}
      <Modal isOpen={isDetailOpen} onClose={onDetailClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedStore?.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Box>
              <img 
                src={selectedStore?.storeImg} 
                alt={selectedStore?.name}
                style={{ width: '100%', height: '200px', objectFit: 'cover', marginBottom: '1rem' }}
              />
              <Table variant="simple">
                <Tbody>
                  <Tr>
                    <Td fontWeight="bold">Địa chỉ</Td>
                    <Td>{selectedStore?.address}</Td>
                  </Tr>
                  <Tr>
                    <Td fontWeight="bold">Số điện thoại</Td>
                    <Td>{selectedStore?.phoneNumber}</Td>
                  </Tr>
                  <Tr>
                    <Td fontWeight="bold">Giờ mở cửa</Td>
                    <Td>{selectedStore?.timeStart} - {selectedStore?.timeEnd}</Td>
                  </Tr>
                  <Tr>
                    <Td fontWeight="bold">Đánh giá</Td>
                    <Td>{selectedStore?.rated}/5</Td>
                  </Tr>
                  <Tr>
                    <Td fontWeight="bold">Trạng thái</Td>
                    <Td>{selectedStore?.status}</Td>
                  </Tr>
                  <Tr>
                    <Td fontWeight="bold">Mô tả</Td>
                    <Td>{selectedStore?.descript}</Td>
                  </Tr>
                </Tbody>
              </Table>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Other modals (Form and Delete) remain the same */}
    </Box>
  );
}