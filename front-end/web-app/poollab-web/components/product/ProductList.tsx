import React from 'react';
import {
  Grid,
  useBreakpointValue,
  Flex,
  Text,
  Button,
  Skeleton,
} from '@chakra-ui/react';
import { Product } from '@/utils/types/product.types';
import { ProductCard } from './ProductCard';

interface ProductListProps {
  products: Product[];
  loading: boolean;
  onRefresh: () => void;
}

export const ProductList: React.FC<ProductListProps> = ({ products, loading, onRefresh }) => {
  const columns = useBreakpointValue({ base: 1, sm: 2, md: 3, lg: 4 }) || 1;

  if (loading) {
    return (
      <Grid templateColumns={`repeat(${columns}, 1fr)`} gap={6}>
        {[...Array(8)].map((_, i) => (
          <Skeleton key={i} height="300px" borderRadius="lg" />
        ))}
      </Grid>
    );
  }

  if (products.length === 0) {
    return (
      <Flex 
        direction="column" 
        align="center" 
        justify="center" 
        py={10}
        bg="gray.50"
        borderRadius="lg"
      >
        <Text color="gray.500">
          Không tìm thấy sản phẩm nào
        </Text>
        <Button
          mt={4}
          size="sm"
          onClick={onRefresh}
        >
          Đặt lại bộ lọc
        </Button>
      </Flex>
    );
  }

  return (
    <Grid templateColumns={`repeat(${columns}, 1fr)`} gap={6}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </Grid>
  );
};