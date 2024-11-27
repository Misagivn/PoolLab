import React from 'react';
import {
  Flex,
  Button,
  Text,
  ButtonGroup,
} from '@chakra-ui/react';

interface ProductPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
}

export const ProductPagination: React.FC<ProductPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  loading
}) => {
  return (
    <Flex 
      direction="column" 
      align="center" 
      gap={4}
      mt={6}
    >
      {/* <Text fontSize="sm" color="gray.600">
        Hiển thị sản phẩm mỗi trang
      </Text> */}

      <ButtonGroup spacing={2} variant="outline">
        <Button
          onClick={() => onPageChange(currentPage - 1)}
          isDisabled={currentPage === 1 || loading}
        >
          Trước
        </Button>
        <Button
          colorScheme="blue"
          disabled={loading}
        >
          {currentPage}
        </Button>
        <Button
          onClick={() => onPageChange(currentPage + 1)}
          isDisabled={currentPage === totalPages || loading}
        >
          Sau
        </Button>
      </ButtonGroup>
    </Flex>
  );
};