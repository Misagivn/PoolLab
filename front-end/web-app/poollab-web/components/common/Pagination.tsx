import { Button, HStack, Text } from '@chakra-ui/react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  return (
    <HStack spacing={2} justify="center" mt={6}>
      <Button
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        isDisabled={currentPage === 1}
      >
        Trước
      </Button>

      {getPageNumbers().map((pageNumber, index) => (
        <Button
          key={index}
          size="sm"
          variant={pageNumber === currentPage ? 'solid' : 'ghost'}
          onClick={() => {
            if (typeof pageNumber === 'number') {
              onPageChange(pageNumber);
            }
          }}
          isDisabled={pageNumber === '...'}
        >
          {pageNumber}
        </Button>
      ))}

      <Button
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        isDisabled={currentPage === totalPages}
      >
        Sau
      </Button>
    </HStack>
  );
};