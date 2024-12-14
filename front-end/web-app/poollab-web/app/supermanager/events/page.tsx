'use client';

import { useEvents } from "@/hooks/useEvent";
import { Badge, Box, Flex, HStack, Heading, Icon, IconButton, Input, InputGroup, InputLeftElement, Spinner, Stack, Table, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react";
import { useState } from "react";
import { FiCalendar, FiRefreshCcw, FiSearch } from "react-icons/fi";

export default function EventPage(){
  const { 
    data: events, 
    loading,
    fetchEvents,
  } = useEvents();
  
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEvents = (events || []).filter(event =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <Flex h="100%" align="center" justify="center" p={6}>
        <Spinner size="xl" color="blue.500" />
      </Flex>
    );
  }

  return (
    <Box p={{ base: 4, md: 6 }}>
      <Stack spacing={6}>
        {/* Header */}
        <Flex justify="space-between" align="center">
          <Heading size="lg">Quản lý sự kiện</Heading>
        </Flex>

        {/* Search and Refresh */}
        <HStack spacing={4}>
          <InputGroup maxW="320px">
            <InputLeftElement>
              <Icon as={FiSearch} color="gray.400" />
            </InputLeftElement>
            <Input
              placeholder="Tìm kiếm sự kiện..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </InputGroup>

          <IconButton
            aria-label="Refresh"
            icon={<Icon as={FiRefreshCcw} />}
            onClick={() => {
              setSearchQuery('');
              fetchEvents();
            }}
          />
        </HStack>

        {/* Events Table */}
        <Table variant="simple" bg="white" boxShadow="sm" rounded="lg">
          <Thead bg="gray.50">
            <Tr>
              <Th>TÊN SỰ KIỆN</Th>
              <Th>NGƯỜI TẠO</Th>
              <Th>THỜI GIAN</Th>
              <Th>TRẠNG THÁI</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredEvents.map((event) => (
              <Tr key={event.id}>
                <Td>
                  <Text fontWeight="medium">{event.title}</Text>
                </Td>
                <Td>{event.fullName}</Td>
                <Td>
                  <HStack color="gray.600" fontSize="sm">
                    <Icon as={FiCalendar} />
                    <Text>{new Date(event.timeStart).toLocaleDateString('vi-VN')}</Text>
                  </HStack>
                </Td>
                <Td>
                  <Badge colorScheme={event.status === 'Đã Tạo' ? 'green' : 'yellow'}>
                    {event.status}
                  </Badge>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>

        {/* Empty State */}
        {filteredEvents.length === 0 && (
          <Flex 
            direction="column" 
            align="center" 
            justify="center" 
            py={10}
            bg="gray.50"
            borderRadius="lg"
          >
            <Text color="gray.500">
              Không tìm thấy sự kiện nào
            </Text>
          </Flex>
        )}
      </Stack>
    </Box>
  );
}