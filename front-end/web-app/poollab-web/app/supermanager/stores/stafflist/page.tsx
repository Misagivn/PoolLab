'use client';

import {
  Box,
  Stack,
  Heading,
  Button,
  HStack,
  InputGroup,
  InputLeftElement,
  Input,
  Icon,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  Badge,
  Avatar,
  Text,
  Flex,
  Spinner,
  useDisclosure,
} from '@chakra-ui/react';
import { useState } from 'react';
import { FiSearch, FiRefreshCcw, FiUserPlus, FiInfo, FiLock, FiUnlock, FiEdit2 } from 'react-icons/fi';
import { useManagers } from '@/hooks/useManagers';
import { ManagerFormModal } from '@/components/manager/ManagerFormModal';
import { ManagerDetailModal } from '@/components/manager/ManagerDetailModal';
import { StatusUpdateModal } from '@/components/member/StatusUpdateModal';
import { ProductPagination } from '@/components/common/paginations';
import { Manager } from '@/utils/types/manager.type';

export default function ManagerPage() {
  const { 
    data: managers,
    stores,
    loading,
    selectedManager,
    pagination,
    fetchManagers,
    createManager,
    updateManager,
    updateManagerStatus,
    selectManager
  } = useManagers();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusMember, setStatusMember] = useState<Manager | null>(null);

  const { 
    isOpen: isFormOpen, 
    onOpen: onFormOpen, 
    onClose: onFormClose 
  } = useDisclosure();

  const { 
    isOpen: isDetailOpen, 
    onOpen: onDetailOpen, 
    onClose: onDetailClose 
  } = useDisclosure();

  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose
  } = useDisclosure();

  const {
    isOpen: isStatusOpen,
    onOpen: onStatusOpen,
    onClose: onStatusClose
  } = useDisclosure();

  const handleRefresh = () => {
    setSearchQuery('');
    fetchManagers(1);
  };

  const handleUpdateStatus = async (status: string) => {
    if (!statusMember) return;
    await updateManagerStatus(statusMember.id, status);
    onStatusClose();
  };

  const filteredManagers = managers.filter(manager =>
    manager.userName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading && managers.length === 0) {
    return (
      <Flex h="100vh" align="center" justify="center">
        <Spinner size="xl" color="blue.500" />
      </Flex>
    );
  }

  return (
    <Box p={6}>
      <Stack spacing={6}>
        <Heading size="lg">Quản lý Manager</Heading>

        <HStack>
          <InputGroup maxW="320px">
            <InputLeftElement>
              <Icon as={FiSearch} color="gray.400" />
            </InputLeftElement>
            <Input
              placeholder="Tìm kiếm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </InputGroup>

          <IconButton
            aria-label="Refresh"
            icon={<Icon as={FiRefreshCcw} />}
            onClick={handleRefresh}
            isLoading={loading}
          />

          <Button
            leftIcon={<Icon as={FiUserPlus} />}
            colorScheme="blue"
            onClick={onFormOpen}
          >
            Thêm Manager
          </Button>
        </HStack>

        <Table variant="simple" bg="white">
          <Thead>
            <Tr>
              <Th>MANAGER</Th>
              <Th>EMAIL</Th>
              <Th>SỐ ĐIỆN THOẠI</Th>
              <Th>CỬA HÀNG</Th>
              <Th>TRẠNG THÁI</Th>
              <Th width="120px" textAlign="right">THAO TÁC</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredManagers.map((manager) => (
              <Tr key={manager.id}>
                <Td>
                  <HStack spacing={3}>
                    <Avatar 
                      size="sm" 
                      name={manager.fullName}
                      src={manager.avatarUrl || undefined}
                    />
                    <Box>
                      <Text fontWeight="medium">{manager.fullName}</Text>
                      <Text fontSize="sm" color="gray.500">{manager.userName}</Text>
                    </Box>
                  </HStack>
                </Td>
                <Td>{manager.email}</Td>
                <Td>{manager.phoneNumber || "Chưa cập nhật"}</Td>
                <Td>
                  {stores.find(store => store.id === manager.storeId)?.name || "Chưa gán"}
                </Td>
                <Td>
                  <Badge
                    colorScheme={manager.status === 'Kích Hoạt' ? 'green' : 'red'}
                  >
                    {manager.status === 'Kích Hoạt' ? 'Hoạt động' : 'Đã khóa'}
                  </Badge>
                </Td>
                <Td>
                  <HStack spacing={2} justify="flex-end">
                    <IconButton
                      aria-label="Chỉnh sửa"
                      icon={<Icon as={FiEdit2} />}
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        selectManager(manager);
                        onEditOpen();
                      }}
                    />
                    <IconButton
                      aria-label="Xem chi tiết"
                      icon={<Icon as={FiInfo} />}
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        selectManager(manager);
                        onDetailOpen();
                      }}
                    />
                    <IconButton
                      aria-label="Thay đổi trạng thái"
                      icon={<Icon as={manager.status === 'Kích Hoạt' ? FiLock : FiUnlock} />}
                      size="sm"
                      variant="ghost"
                      colorScheme={manager.status === 'Kích Hoạt' ? 'red' : 'green'}
                      onClick={() => {
                        setStatusMember(manager);
                        onStatusOpen();
                      }}
                    />
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>

        {filteredManagers.length === 0 && (
          <Flex 
            direction="column" 
            align="center" 
            justify="center" 
            py={10}
            bg="gray.50"
            borderRadius="lg"
          >
            <Text color="gray.500">
              Không tìm thấy quản lý nào
            </Text>
            <Button
              mt={4}
              size="sm"
              leftIcon={<Icon as={FiRefreshCcw} />}
              onClick={handleRefresh}
            >
              Làm mới
            </Button>
          </Flex>
        )}

        {managers.length > 0 && (
          <ProductPagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={page => fetchManagers(page)}
            loading={loading}
          />
        )}

        {/* Create/Edit Modal */}
        <ManagerFormModal
          isOpen={isFormOpen || isEditOpen}
          onClose={isEditOpen ? onEditClose : onFormClose}
          onSubmit={isEditOpen ? updateManager : createManager}
          stores={stores}
          initialData={isEditOpen ? selectedManager : undefined}
          title={isEditOpen ? "Cập nhật thông tin quản lý" : "Thêm quản lý mới"}
        />

        {/* Detail Modal */}
        <ManagerDetailModal
          isOpen={isDetailOpen}
          onClose={onDetailClose}
          manager={selectedManager}
          stores={stores}
        />

        {/* Status Update Modal */}
        <StatusUpdateModal
          isOpen={isStatusOpen}
          onClose={onStatusClose}
          member={statusMember}
          onUpdateStatus={handleUpdateStatus}
          isLoading={loading}
        />
      </Stack>
    </Box>
  );
}