'use client';

import {
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useToast,
  Stack,
  Text,
} from '@chakra-ui/react';
import { useEffect, useState, useRef } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiRefreshCcw } from 'react-icons/fi';
import { BilliardType } from '@/utils/types/table.types';
import { billiardTypeApi } from '@/apis/billiard-type.api';
import { BilliardTypeFormModal } from '@/components/billiardTable/BilliardTypeFormModal';

export default function BilliardTypePage() {
  const [types, setTypes] = useState<BilliardType[]>([]);
  const [selectedType, setSelectedType] = useState<BilliardType | null>(null);
  const [loading, setLoading] = useState(true);
  const [typeToDelete, setTypeToDelete] = useState<BilliardType | null>(null);

  const { 
    isOpen: isFormOpen, 
    onOpen: onFormOpen, 
    onClose: onFormClose 
  } = useDisclosure();
  
  const { 
    isOpen: isDeleteOpen, 
    onOpen: onDeleteOpen, 
    onClose: onDeleteClose 
  } = useDisclosure();

  const cancelRef = useRef(null);
  const toast = useToast();

  const fetchTypes = async () => {
    try {
      setLoading(true);
      const response = await billiardTypeApi.getAllTypes();
      if (response.status === 200) {
        setTypes(response.data);
      }
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Không thể tải danh sách loại bàn',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTypes();
  }, []);

  const handleAddType = async (data: Omit<BilliardType, 'id'>) => {
    try {
      const response = await billiardTypeApi.createType(data);
      if (response.status === 200) {
        toast({
          title: 'Thành công',
          description: 'Thêm loại bàn mới thành công',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        fetchTypes();
      }
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Không thể thêm loại bàn mới',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleUpdateType = async (data: Omit<BilliardType, 'id'>) => {
    if (!selectedType) return;
    try {
      const response = await billiardTypeApi.updateType(selectedType.id, data);
      if (response.status === 200) {
        toast({
          title: 'Thành công',
          description: 'Cập nhật loại bàn thành công',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        fetchTypes();
      }
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Không thể cập nhật loại bàn',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDeleteType = async () => {
    if (!typeToDelete) return;
    try {
      const response = await billiardTypeApi.deleteType(typeToDelete.id);
      if (response.status === 200) {
        toast({
          title: 'Thành công',
          description: 'Xóa loại bàn thành công',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        fetchTypes();
        onDeleteClose();
      }
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Không thể xóa loại bàn',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={6}>
      <Stack spacing={6}>
        {/* Header */}
        <Flex justify="space-between" align="center">
          <Heading size="lg">Quản lý loại bàn</Heading>
          <Button
            leftIcon={<Icon as={FiPlus} />}
            colorScheme="blue"
            onClick={() => {
              setSelectedType(null);
              onFormOpen();
            }}
          >
            Thêm loại bàn
          </Button>
        </Flex>

        {/* Types Table */}
        <Table variant="simple" bg="white" boxShadow="sm" rounded="lg">
          <Thead bg="gray.50">
            <Tr>
              <Th>TÊN LOẠI BÀN</Th>
              <Th>MÔ TẢ</Th>
              <Th width="100px" textAlign="right">THAO TÁC</Th>
            </Tr>
          </Thead>
          <Tbody>
            {types.map((type) => (
              <Tr key={type.id}>
                <Td fontWeight="medium">{type.name}</Td>
                <Td>{type.descript || '-'}</Td>
                <Td>
                  <Flex justify="flex-end" gap={2}>
                    <IconButton
                      aria-label="Edit"
                      icon={<Icon as={FiEdit2} />}
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setSelectedType(type);
                        onFormOpen();
                      }}
                    />
                    <IconButton
                      aria-label="Delete"
                      icon={<Icon as={FiTrash2} />}
                      size="sm"
                      variant="ghost"
                      colorScheme="red"
                      onClick={() => {
                        setTypeToDelete(type);
                        onDeleteOpen();
                      }}
                    />
                  </Flex>
                </Td>
              </Tr>
            ))}

            {types.length === 0 && (
              <Tr>
                <Td colSpan={3}>
                  <Flex 
                    direction="column" 
                    align="center" 
                    justify="center" 
                    py={10}
                  >
                    <Text color="gray.500" mb={4}>
                      Chưa có loại bàn nào
                    </Text>
                    <Button
                      leftIcon={<Icon as={FiRefreshCcw} />}
                      onClick={fetchTypes}
                    >
                      Tải lại
                    </Button>
                  </Flex>
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </Stack>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        isOpen={isDeleteOpen}
        leastDestructiveRef={cancelRef}
        onClose={onDeleteClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Xóa loại bàn
            </AlertDialogHeader>

            <AlertDialogBody>
              Bạn có chắc chắn muốn xóa loại bàn "{typeToDelete?.name}"? 
              Hành động này không thể hoàn tác.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onDeleteClose}>
                Hủy
              </Button>
              <Button colorScheme="red" onClick={handleDeleteType} ml={3}>
                Xóa
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      {/* Form Modal */}
      <BilliardTypeFormModal
        isOpen={isFormOpen}
        onClose={() => {
          onFormClose();
          setSelectedType(null);
        }}
        onSubmit={selectedType ? handleUpdateType : handleAddType}
        initialData={selectedType}
        title={selectedType ? 'Chỉnh sửa loại bàn' : 'Thêm loại bàn mới'}
      />
    </Box>
  );
}