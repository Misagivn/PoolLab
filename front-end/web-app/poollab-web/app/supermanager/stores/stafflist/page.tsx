'use client';

import {
 Box,
 Flex,
 Text,
 Heading,
 Badge,
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
 Select,
 HStack,
 IconButton,
 Button,
 Avatar,
 Icon,
 useDisclosure,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { 
 FiSearch, 
 FiRefreshCcw,
 FiUserPlus,
 FiInfo,
 FiEdit2 
} from 'react-icons/fi';
import { useManagers } from '@/hooks/useManagers';
import { StaffFormModal as ManagerFormModal } from '@/components/staff/StaffFormModal';
import { StaffDetailModal as ManagerDetailModal } from '@/components/staff/StaffDetailModal';
import { UpdateStaffModal as UpdateManagerModal } from '@/components/staff/UpdateStaffModal';
import { ProductPagination } from '@/components/common/paginations';

export default function ManagersPage() {
 const { 
   managers, 
   loading,
   pagination,
   fetchManagers,
   selectedManager,
   selectManager,
   getWorkingStatus 
 } = useManagers();
 
 const [searchQuery, setSearchQuery] = useState('');
 const [filter, setFilter] = useState('all');
 
 const { 
   isOpen: isDetailOpen, 
   onOpen: onDetailOpen, 
   onClose: onDetailClose 
 } = useDisclosure();
 
 const { 
   isOpen: isFormOpen, 
   onOpen: onFormOpen, 
   onClose: onFormClose 
 } = useDisclosure();

 const {
   isOpen: isUpdateOpen,
   onOpen: onUpdateOpen,
   onClose: onUpdateClose
 } = useDisclosure();

 useEffect(() => {
   fetchManagers(1);
 }, [fetchManagers]);

 useEffect(() => {
   fetchManagers(1);
 }, [searchQuery, filter, fetchManagers]);

 const handlePageChange = (page: number) => {
   fetchManagers(page);
 };

 const handleRefresh = () => {
   setSearchQuery('');
   setFilter('all');
   fetchManagers(1);
 };

 if (loading && managers.length === 0) {
   return (
     <Flex h="100%" align="center" justify="center" p={6}>
       <Spinner size="xl" color="blue.500" />
     </Flex>
   );
 }

 return (
   <Box p={6}>
     <Stack spacing={6}>
       {/* Header */}
       <Flex justify="space-between" align="center">
         <Heading size="lg">Quản lý cửa hàng trưởng</Heading>
         <Button
           leftIcon={<Icon as={FiUserPlus} />}
           colorScheme="blue"
           onClick={onFormOpen}
         >
           Thêm quản lý
         </Button>
       </Flex>

       {/* Search and Filter */}
       <HStack spacing={4}>
         <InputGroup maxW="320px">
           <InputLeftElement>
             <Icon as={FiSearch} color="gray.400" />
           </InputLeftElement>
           <Input
             placeholder="Tìm kiếm quản lý..."
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
           />
         </InputGroup>

         <Select
           w="200px"
           value={filter}
           onChange={(e) => setFilter(e.target.value)}
         >
           <option value="all">Tất cả trạng thái</option>
           <option value="đang làm việc">Đang làm việc</option>
           <option value="đã nghỉ việc">Đã nghỉ việc</option>
         </Select>

         <IconButton
           aria-label="Refresh"
           icon={<Icon as={FiRefreshCcw} />}
           onClick={handleRefresh}
           isLoading={loading}
         />
       </HStack>

       {/* Table */}
       <Box overflowX="auto">
         <Table variant="simple" bg="white">
           <Thead bg="gray.50">
             <Tr>
               <Th width="80px" textAlign="center">STT</Th>
               <Th>QUẢN LÝ</Th>
               <Th>EMAIL</Th>
               <Th>SỐ ĐIỆN THOẠI</Th>
               <Th>TRẠNG THÁI</Th>
               <Th width="100px" textAlign="right">THAO TÁC</Th>
             </Tr>
           </Thead>
           <Tbody>
             {managers.map((manager, index) => (
               <Tr key={manager.id}>
                 <Td textAlign="center">
                   {(pagination.currentPage - 1) * pagination.pageSize + index + 1}
                 </Td>
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
                   <Badge
                     colorScheme={manager.status === 'Kích hoạt' ? 'green' : 'red'}
                   >
                     {getWorkingStatus(manager.status)}
                   </Badge>
                 </Td>
                 <Td>
                   <HStack spacing={2} justify="flex-end">
                     <IconButton
                       aria-label="Edit manager"
                       icon={<Icon as={FiEdit2} />}
                       size="sm"
                       variant="ghost"
                       onClick={() => {
                         selectManager(manager);
                         onUpdateOpen();
                       }}
                     />
                     <IconButton
                       aria-label="View details"
                       icon={<Icon as={FiInfo} />}
                       size="sm"
                       variant="ghost"
                       onClick={() => {
                         selectManager(manager);
                         onDetailOpen();
                       }}
                     />
                   </HStack>
                 </Td>
               </Tr>
             ))}
           </Tbody>
         </Table>
       </Box>

       {managers.length === 0 ? (
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
             onClick={handleRefresh}
           >
             Đặt lại bộ lọc
           </Button>
         </Flex>
       ) : (
         <ProductPagination
           currentPage={pagination.currentPage}
           totalPages={pagination.totalPages}
           onPageChange={handlePageChange}
           loading={loading}
         />
       )}

       {/* Modals */}
       <ManagerFormModal
         isOpen={isFormOpen}
         onClose={onFormClose}
       />

       <ManagerDetailModal
         isOpen={isDetailOpen}
         onClose={onDetailClose}
         staff={selectedManager}
       />

       <UpdateManagerModal 
         isOpen={isUpdateOpen}
         onClose={onUpdateClose}
         staff={selectedManager}
       />
     </Stack>
   </Box>
 );
}