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
  Select,
  HStack,
  Icon,
  Card,
  CardBody,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { FiSearch, FiStar, FiUser, FiMapPin } from 'react-icons/fi';
import { useReviews } from '@/hooks/useFeedback';
import { useStores } from '@/hooks/useStores';
import { ProductPagination } from '@/components/common/paginations';

export default function FeedbackPage() {
  const { 
    data: reviews, 
    loading: reviewsLoading,
    pagination,
    fetchReviews 
  } = useReviews();

  const {
    data: stores,
    loading: storesLoading,
    fetchStores
  } = useStores();
  
  const [username, setUsername] = useState('');
  const [selectedStore, setSelectedStore] = useState<string>('');

  useEffect(() => {
    fetchStores(1);
  }, [fetchStores]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchReviews(1, {
        username,
        storeName: selectedStore
      });
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [username, selectedStore, fetchReviews]);

  const handlePageChange = (page: number) => {
    fetchReviews(page, {
      username,
      storeName: selectedStore
    });
  };

  if (reviewsLoading || storesLoading) {
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
        <Heading size={{ base: "md", md: "lg" }}>Quản lý đánh giá</Heading>

        {/* Filters */}
        <HStack spacing={4}>
          <InputGroup maxW="320px">
            <InputLeftElement>
              <Icon as={FiSearch} color="gray.400" />
            </InputLeftElement>
            <Input
              placeholder="Tìm kiếm"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </InputGroup>

          <Select
            placeholder="Chọn cửa hàng"
            value={selectedStore}
            onChange={(e) => setSelectedStore(e.target.value)}
            maxW="320px"
          >
            {/* <option value="">Tất cả cửa hàng</option> */}
            {stores.map(store => (
              <option key={store.id} value={store.name}>
                {store.name}
              </option>
            ))}
          </Select>
        </HStack>

        {/* Reviews List */}
        <Stack spacing={4}>
          {reviews.map((review) => (
            <Card key={review.id}>
              <CardBody>
                <Stack spacing={3}>
                  <Flex justify="space-between" align="center">
                    <HStack>
                      <Icon as={FiUser} color="blue.500" />
                      <Text fontWeight="bold">{review.cusName}</Text>
                    </HStack>
                    <HStack>
                      <Icon as={FiStar} color="yellow.400" />
                      <Text fontWeight="bold">{review.rated}/5</Text>
                    </HStack>
                  </Flex>

                  <Text>{review.message}</Text>

                  <HStack color="gray.600" fontSize="sm">
                    <Icon as={FiMapPin} />
                    <Text>{review.storeName} - {review.address}</Text>
                  </HStack>

                  <Text fontSize="sm" color="gray.500">
                    Ngày đánh giá: {new Date(review.createdDate).toLocaleDateString('vi-VN')}
                  </Text>
                </Stack>
              </CardBody>
            </Card>
          ))}
        </Stack>

        {/* Empty State */}
        {reviews.length === 0 && (
          <Flex 
            direction="column" 
            align="center" 
            justify="center" 
            py={10}
            bg="gray.50"
            borderRadius="lg"
          >
            <Icon as={FiStar} fontSize="3xl" color="gray.400" mb={2} />
            <Text color="gray.500">
              Không tìm thấy đánh giá nào
            </Text>
          </Flex>
        )}

        {/* Pagination */}
        {reviews.length > 0 && (
          <ProductPagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
            loading={reviewsLoading}
          />
        )}
      </Stack>
    </Box>
  );
}