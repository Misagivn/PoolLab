'use client';

import {
  Box,
  Flex,
  Text,
  Heading,
  Spinner,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  HStack,
  IconButton,
  Avatar,
  Icon,
  Badge,
  useDisclosure,
  Card,
  CardBody,
} from '@chakra-ui/react';
import { useState } from 'react';
import { FiSearch, FiRefreshCcw, FiInfo, FiLock, FiUnlock } from 'react-icons/fi';
import { useMembers } from '@/hooks/useMembers';
import { MemberDetailModal } from '@/components/member/MemberDetailModal';
import { StatusUpdateModal } from '@/components/member/StatusUpdateModal';
import { ProductPagination } from '@/components/common/paginations';
import { formatCurrency } from '@/utils/format';
import { Staff as Member } from '@/utils/types/staff.types';

export default function MemberPage() {
  const { 
    data: members, 
    loading,
    searchQuery,
    setSearchQuery,
    pagination,
    fetchMembers,
    selectedMember,
    selectMember,
    getMemberStatus,
    updateMemberStatus
  } = useMembers();

  const [statusMember, setStatusMember] = useState<Member | null>(null);
  

  const { 
    isOpen: isDetailOpen, 
    onOpen: onDetailOpen, 
    onClose: onDetailClose 
  } = useDisclosure();

  const { 
    isOpen: isStatusOpen, 
    onOpen: onStatusOpen, 
    onClose: onStatusClose 
  } = useDisclosure();

  const handlePageChange = (page: number) => {
    fetchMembers(page);
  };

  const handleRefresh = () => {
    setSearchQuery('');
    fetchMembers(1);
  };

  const handleUpdateStatus = async (status: string) => {
    if (!statusMember) return;
    await updateMemberStatus(statusMember.id, status);
    onStatusClose();
  };

  if (loading && members.length === 0) {
    return (
      <Flex h="100vh" align="center" justify="center">
        <Spinner size="xl" color="blue.500" />
      </Flex>
    );
  }

  return (
    <Box p={4}>
      <Stack spacing={4}>
        <Heading size="lg">Quản lý thành viên</Heading>

        <HStack spacing={4}>
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
        </HStack>

        <Card>
          <CardBody p={0}>
            <Table variant="simple" size="sm">
              <Thead bg="gray.50">
                <Tr>
                  <Th>THÀNH VIÊN</Th>
                  <Th>EMAIL</Th>
                  <Th>SỐ ĐIỆN THOẠI</Th>
                  <Th isNumeric>SỐ DƯ</Th>
                  <Th>TRẠNG THÁI</Th>
                  <Th width="100px" textAlign="right">THAO TÁC</Th>
                </Tr>
              </Thead>
              <Tbody>
                {members.map((member) => (
                  <Tr key={member.id}>
                    <Td>
                      <HStack spacing={3}>
                        <Avatar 
                          size="sm" 
                          name={member.fullName}
                          src={member.avatarUrl || undefined}
                        />
                        <Box>
                          <Text fontWeight="medium">{member.fullName}</Text>
                          <Text fontSize="sm" color="gray.500">{member.userName}</Text>
                        </Box>
                      </HStack>
                    </Td>
                    <Td>{member.email}</Td>
                    <Td>{member.phoneNumber || "Chưa cập nhật"}</Td>
                    <Td isNumeric>
                      <Text color="blue.500" fontWeight="medium">
                        {formatCurrency(member.balance)}
                      </Text>
                    </Td>
                    <Td>
                      <Badge
                        colorScheme={member.status === 'Kích Hoạt' ? 'green' : 'red'}
                        fontSize="xs"
                        px={2}
                        py={0.5}
                      >
                        {getMemberStatus(member.status)}
                      </Badge>
                    </Td>
                    <Td>
                      <HStack spacing={2} justify="flex-end">
                        <IconButton
                          aria-label="Xem chi tiết"
                          icon={<Icon as={FiInfo} />}
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            selectMember(member);
                            onDetailOpen();
                          }}
                        />
                        <IconButton
                          aria-label="Thay đổi trạng thái"
                          icon={<Icon as={member.status === 'Kích Hoạt' ? FiLock : FiUnlock} />}
                          size="sm"
                          variant="ghost"
                          colorScheme={member.status === 'Kích Hoạt' ? 'red' : 'green'}
                          onClick={() => {
                            setStatusMember(member);
                            onStatusOpen();
                          }}
                        />
                      </HStack>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>

            {members.length === 0 && (
              <Flex 
                direction="column" 
                align="center" 
                justify="center" 
                py={10}
                bg="gray.50"
                borderRadius="lg"
              >
                <Text color="gray.500">
                  Không tìm thấy thành viên nào
                </Text>
              </Flex>
            )}
          </CardBody>
        </Card>

        {members.length > 0 && (
          <ProductPagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
            loading={loading}
          />
        )}

        {/* Modals */}
        <MemberDetailModal
          isOpen={isDetailOpen}
          onClose={onDetailClose}
          member={selectedMember}
        />

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