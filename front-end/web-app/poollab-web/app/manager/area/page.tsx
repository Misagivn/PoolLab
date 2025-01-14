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
  Button,
  Icon,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useToast,
  Image,
} from '@chakra-ui/react';
import { useState, useEffect, useRef } from 'react';
import { 
  FiSearch, 
  FiRefreshCcw,
  FiEdit2,
  FiTrash2,
  FiMapPin,
  FiInfo,
  FiPlus,
  FiMap
} from 'react-icons/fi';
import { useArea } from '@/hooks/useArea';
import { AreaDetailModal } from '@/components/area/AreaDetailModal';
import { AreaFormModal } from '@/components/area/AreaFormModal';
import { Area } from '@/utils/types/area.types';
import { jwtDecode } from 'jwt-decode';
import { JWTPayload } from '@/utils/types/area.types';

export default function AreaPage() {
  const { 
    areas, 
    loading, 
    fetchAreas, 
    createArea, 
    updateArea, 
    deleteArea 
  } = useArea();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArea, setSelectedArea] = useState<Area | null>(null);
  const [areaToDelete, setAreaToDelete] = useState<Area | null>(null);
  const cancelRef = useRef(null);
  const toast = useToast();

  // Modals state
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
    isOpen: isDeleteOpen, 
    onOpen: onDeleteOpen, 
    onClose: onDeleteClose 
  } = useDisclosure();

  useEffect(() => {
    fetchAreas();
  }, [fetchAreas]);

  const handleAddArea = async (data: Partial<Area>) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const decoded = jwtDecode(token) as JWTPayload;
      await createArea({
        ...data,
        storeId: decoded.storeId,
      } as Omit<Area, 'id'>);
      onFormClose();
    } catch (error) {
      console.error('Error adding area:', error);
    }
  };

  const handleEditArea = async (data: Partial<Area>) => {
    if (!selectedArea) return;
    try {
      await updateArea(selectedArea.id, {
        ...data,
        storeId: selectedArea.storeId,
      } as Omit<Area, 'id'>);
      onFormClose();
      setSelectedArea(null);
    } catch (error) {
      console.error('Error updating area:', error);
    }
  };

  const handleDeleteArea = async () => {
    if (!areaToDelete) return;
    try {
      await deleteArea(areaToDelete.id);
      onDeleteClose();
      setAreaToDelete(null);
    } catch (error) {
      console.error('Error deleting area:', error);
    }
  };

  const filteredAreas = areas.filter(area => 
    (area?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
    (area?.descript?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
  );

  if (loading) {
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
          <Heading size="lg">Quản lý khu vực</Heading>
          <Button
            leftIcon={<Icon as={FiPlus} />}
            colorScheme="blue"
            onClick={() => {
              setSelectedArea(null);
              onFormOpen();
            }}
          >
            Thêm khu vực
          </Button>
        </Flex>

        {/* Search and Refresh */}
        <HStack spacing={4}>
          <InputGroup maxW="320px">
            <InputLeftElement>
              <Icon as={FiSearch} color="gray.400" />
            </InputLeftElement>
            <Input
              placeholder="Tìm kiếm khu vực..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </InputGroup>

          <IconButton
            aria-label="Refresh"
            icon={<Icon as={FiRefreshCcw} />}
            onClick={() => {
              setSearchQuery('');
              fetchAreas();
            }}
          />
        </HStack>

        {/* Areas Table */}
        <Table variant="simple" bg="white">
          <Thead bg="gray.50">
            <Tr>
              <Th>TÊN KHU VỰC</Th>
              <Th>MÔ TẢ</Th>
              <Th width="100px" textAlign="right">THAO TÁC</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredAreas.map((area) => (
              <Tr key={area.id}>
                <Td>
                  <HStack spacing={3}>
                    {area.areaImg ? (
                      <Image
                        src={area.areaImg}
                        alt={area.name}
                        boxSize="32px"
                        objectFit="cover"
                        borderRadius="md"
                        fallback={<Icon as={FiMapPin} color="blue.500" />}
                      />
                    ) : (
                      <Box
                        w="32px"
                        h="32px"
                        bg="gray.100"
                        borderRadius="md"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Icon as={FiMap} color="gray.400" />
                      </Box>
                    )}
                    <Text fontWeight="medium">{area.name}</Text>
                  </HStack>
                </Td>
                <Td>{area.descript || "Chưa có mô tả"}</Td>
                <Td>
                  <HStack spacing={2} justify="flex-end">
                    <IconButton
                      aria-label="View details"
                      icon={<Icon as={FiInfo} />}
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setSelectedArea(area);
                        onDetailOpen();
                      }}
                    />
                    <IconButton
                      aria-label="Edit area"
                      icon={<Icon as={FiEdit2} />}
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setSelectedArea(area);
                        onFormOpen();
                      }}
                    />
                    <IconButton
                      aria-label="Delete area"
                      icon={<Icon as={FiTrash2} />}
                      size="sm"
                      variant="ghost"
                      colorScheme="red"
                      onClick={() => {
                        setAreaToDelete(area);
                        onDeleteOpen();
                      }}
                    />
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>


        {/* Empty State */}
        {filteredAreas.length === 0 && (
          <Flex 
            direction="column" 
            align="center" 
            justify="center" 
            py={10}
            bg="gray.50"
            borderRadius="lg"
          >
            <Icon as={FiMap} fontSize="3xl" color="gray.400" mb={2} />
            <Text color="gray.500">
              Không tìm thấy khu vực nào
            </Text>
            <Button
              mt={4}
              size="sm"
              leftIcon={<Icon as={FiRefreshCcw} />}
              onClick={() => setSearchQuery('')}
            >
              Đặt lại bộ lọc
            </Button>
          </Flex>
        )}

        {/* Area Detail Modal */}
        <AreaDetailModal
          isOpen={isDetailOpen}
          onClose={onDetailClose}
          area={selectedArea}
        />

        {/* Area Form Modal */}
        <AreaFormModal
          isOpen={isFormOpen}
          onClose={() => {
            onFormClose();
            setSelectedArea(null);
          }}
          onSubmit={selectedArea ? handleEditArea : handleAddArea}
          initialData={selectedArea ?? undefined}
          title={selectedArea != null ?'Chỉnh sửa khu vực' : 'Thêm khu vực mới'}
        />

        {/* Delete Confirmation Dialog */}
        <AlertDialog
          isOpen={isDeleteOpen}
          leastDestructiveRef={cancelRef}
          onClose={onDeleteClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Xóa khu vực
              </AlertDialogHeader>

              <AlertDialogBody>
                Bạn có chắc chắn muốn xóa khu vực "{areaToDelete?.name}"? 
                Hành động này không thể hoàn tác.
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onDeleteClose}>
                  Hủy
                </Button>
                <Button colorScheme="red" onClick={handleDeleteArea} ml={3}>
                  Xóa
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </Stack>
    </Box>
  );
}