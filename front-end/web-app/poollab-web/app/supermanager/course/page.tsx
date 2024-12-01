"use client";

import { useState } from 'react';
import { 
  Box,
  Heading,
  Button,
  HStack,
  useDisclosure,
  Input,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';
import { SearchIcon, AddIcon } from '@chakra-ui/icons';
import { useCourses } from '@/hooks/useCourses';
import { ProductPagination } from '@/components/common/paginations';
import { CourseList } from '@/components/course/courseList';
import { CreateCourseModal } from '@/components/course/courseCreate';

export default function CourseListPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const { data, isLoading, refetch } = useCourses(page, search);
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box p={8}>
      <HStack justify="space-between" mb={6}>
        <Heading>Course Management</Heading>
        <Button leftIcon={<AddIcon />} colorScheme="blue" onClick={onOpen}>
          Create Course
        </Button>
      </HStack>

      <InputGroup mb={6}>
        <InputLeftElement pointerEvents="none">
          <SearchIcon color="gray.300" />
        </InputLeftElement>
        <Input
          placeholder="Search courses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </InputGroup>

      <CourseList courses={data?.items || []} isLoading={isLoading} />
      
      <ProductPagination
        currentPage={page}
        totalPages={data?.totalPages || 1}
        onPageChange={setPage}
        loading={isLoading}
      />

      <CreateCourseModal
        isOpen={isOpen}
        onClose={onClose}
        onSuccess={refetch}
      />
    </Box>
  );
}