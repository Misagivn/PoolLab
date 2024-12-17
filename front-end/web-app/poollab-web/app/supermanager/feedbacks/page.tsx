'use client';

import {
  Container,
  Box,
  Heading,
  VStack,
  HStack,
  Text,
  Card,
  CardHeader,
  CardBody,
  Badge,
  Skeleton,
  Input,
  Select,
  InputGroup,
  InputLeftElement,
  Icon,
  IconButton,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';
import { FiSearch, FiArrowUp, FiArrowDown } from 'react-icons/fi';
import { useFeedback } from '@/hooks/useFeedback';

export default function FeedbackPage() {
  const {
    feedbacks,
    stores,
    loading,
    selectedStore,
    searchTerm,
    sortAscending,
    handleSearchChange,
    handleStoreChange,
    toggleSortDirection,
  } = useFeedback();

  return (
    <Container maxW="container.xl" py={6}>
      <Box mb={6}>
        <Heading size="lg" mb={4}>Đánh giá từ khách hàng</Heading>

        <HStack spacing={4} mb={6}>
          <InputGroup maxW="320px">
            <InputLeftElement>
              <Icon as={FiSearch} color="gray.400" />
            </InputLeftElement>
            <Input
              placeholder="Tìm kiếm theo tên khách hàng..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </InputGroup>

          <Select
            value={selectedStore}
            onChange={(e) => handleStoreChange(e.target.value)}
            maxW="250px"
            isRequired
          >
            {stores.map((store) => (
              <option key={store.id} value={store.id}>
                {store.name}
              </option>
            ))}
          </Select>

          <IconButton
            aria-label="Sort direction"
            icon={sortAscending ? <FiArrowUp /> : <FiArrowDown />}
            onClick={toggleSortDirection}
          />
        </HStack>

        {loading ? (
          <VStack spacing={4}>
            {Array.from({ length: 3 }).map((_, idx) => (
              <Skeleton key={idx} height="200px" width="100%" />
            ))}
          </VStack>
        ) : feedbacks.length === 0 ? (
          <Alert status="info" borderRadius="md">
            <AlertIcon />
            {searchTerm ? 
              'Không tìm thấy đánh giá nào phù hợp' : 
              'Chưa có đánh giá nào cho cửa hàng này'}
          </Alert>
        ) : (
          <VStack spacing={4} align="stretch">
            {feedbacks.map((feedback) => (
              <Card key={feedback.id}>
                <CardHeader>
                  <HStack justify="space-between">
                    <VStack align="start" spacing={1}>
                      <Text fontWeight="bold">{feedback.cusName}</Text>
                      <Text fontSize="sm" color="gray.500">
                        {new Date(feedback.createdDate).toLocaleDateString('vi-VN')}
                      </Text>
                    </VStack>
                    <HStack>
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <StarIcon
                          key={idx}
                          color={idx < feedback.rated ? "yellow.400" : "gray.300"}
                        />
                      ))}
                      <Badge colorScheme="blue" ml={2}>
                        {feedback.rated}/5
                      </Badge>
                    </HStack>
                  </HStack>
                </CardHeader>
                <CardBody pt={0}>
                  <Text>{feedback.message || "Không có bình luận"}</Text>
                </CardBody>
              </Card>
            ))}
          </VStack>
        )}
      </Box>
    </Container>
  );
}