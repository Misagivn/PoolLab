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

import { ProductUnitFormModal } from '@/components/productGTU/ProductUnitForm';
import { unitApi } from '@/apis/productUnit.api';
import { Unit } from '@/utils/types/productUnit.types';




export default function ProductUnitPage() {
  const [groups, setGroups] = useState<Unit[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<Unit | null>(null);
  const [loading, setLoading] = useState(true);
  const [groupToDelete, setGroupToDelete] = useState<Unit | null>(null);

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

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const response = await unitApi.getAllUnits();
      if (response.status === 200) {
        setGroups(response.data);
      }
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Không thể tải danh sách nhóm sản phẩm',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleAddGroup = async (data: Omit<Unit, 'id'>) => {
    try {
      const response = await unitApi.createGroup(data);
      if (response.status === 200) {
        toast({
          title: 'Thành công',
          description: 'Thêm nhóm sản phẩm mới thành công',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        fetchGroups();
      }
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Không thể thêm nhóm sản phẩm mới',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleUpdateGroup = async (data: Omit<Unit, 'id'>) => {
    if (!selectedGroup) return;
    try {
      const response = await unitApi.updateGroup(selectedGroup.id, data);
      if (response.status === 200) {
        toast({
          title: 'Thành công',
          description: 'Cập nhật nhóm sản phẩm thành công',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        fetchGroups();
      }
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Không thể cập nhật nhóm sản phẩm',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDeleteGroup = async () => {
    if (!groupToDelete) return;
    try {
      const response = await unitApi.deleteGroup(groupToDelete.id);
      if (response.status === 200) {
        toast({
          title: 'Thành công',
          description: 'Xóa nhóm sản phẩm thành công',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        fetchGroups();
        onDeleteClose();
      }
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Không thể xóa nhóm sản phẩm',
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
          <Heading size="lg">Quản lý nhóm sản phẩm</Heading>
          <Button
            leftIcon={<Icon as={FiPlus} />}
            colorScheme="blue"
            onClick={() => {
              setSelectedGroup(null);
              onFormOpen();
            }}
          >
            Thêm nhóm sản phẩm
          </Button>
        </Flex>

        {/* Groups Table */}
        <Table variant="simple" bg="white" boxShadow="sm" rounded="lg">
          <Thead bg="gray.50">
            <Tr>
              <Th>TÊN NHÓM</Th>
              <Th>MÔ TẢ</Th>
              <Th width="100px" textAlign="right">THAO TÁC</Th>
            </Tr>
          </Thead>
          <Tbody>
            {groups.map((group) => (
              <Tr key={group.id}>
                <Td fontWeight="medium">{group.name}</Td>
                <Td>{group.descript || '-'}</Td>
                <Td>
                  <Flex justify="flex-end" gap={2}>
                    <IconButton
                      aria-label="Edit"
                      icon={<Icon as={FiEdit2} />}
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setSelectedGroup(group);
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
                        setGroupToDelete(group);
                        onDeleteOpen();
                      }}
                    />
                  </Flex>
                </Td>
              </Tr>
            ))}

            {groups.length === 0 && !loading && (
              <Tr>
                <Td colSpan={3}>
                  <Flex 
                    direction="column" 
                    align="center" 
                    justify="center" 
                    py={10}
                  >
                    <Text color="gray.500" mb={4}>
                      Chưa có nhóm sản phẩm nào
                    </Text>
                    <Button
                      leftIcon={<Icon as={FiRefreshCcw} />}
                      onClick={fetchGroups}
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
              Xóa nhóm sản phẩm
            </AlertDialogHeader>

            <AlertDialogBody>
              Bạn có chắc chắn muốn xóa nhóm sản phẩm "{groupToDelete?.name}"? 
              Hành động này không thể hoàn tác.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onDeleteClose}>
                Hủy
              </Button>
              <Button colorScheme="red" onClick={handleDeleteGroup} ml={3}>
                Xóa
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      {/* Form Modal */}
      <ProductUnitFormModal
        isOpen={isFormOpen}
        onClose={() => {
          onFormClose();
          setSelectedGroup(null);
        }}
        onSubmit={selectedGroup ? handleUpdateGroup : handleAddGroup}
        initialData={selectedGroup}
        title={selectedGroup ? 'Chỉnh sửa nhóm sản phẩm' : 'Thêm nhóm sản phẩm mới'}
      />
    </Box>
  );
}