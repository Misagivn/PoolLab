"use client";

import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Icon,
  IconButton,
  HStack,
  Box,
} from '@chakra-ui/react';
import { FiInfo, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { Course } from '@/utils/types/course';

interface CourseListProps {
  courses: Course[];
  isLoading: boolean;
}

export const CourseList = ({ courses, isLoading }: CourseListProps) => {
  return (
    <Table variant="simple" bg="white" rounded="lg" shadow="sm">
      <Thead>
        <Tr bg="gray.50">
          <Th>STT</Th>
          <Th>TÊN KHÓA HỌC</Th>
          <Th>CƠ SỞ</Th>
          <Th>CẤP ĐỘ</Th>
          <Th>GIÁ</Th>
          <Th>NGÀY BẮT ĐẦU</Th>
          <Th>TRẠNG THÁI</Th>
          <Th>THAO TÁC</Th>
        </Tr>
      </Thead>
      <Tbody>
        {courses.map((course, index) => (
          <Tr key={course.id}>
            <Td>{index + 1}</Td>
            <Td>{course.title}</Td>
            <Td>{course.storeName || 'N/A'}</Td>
            <Td>{course.level || 'N/A'}</Td>
            <Td>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(course.price)}</Td>
            <Td>{new Date(course.startDate).toLocaleDateString()}</Td>
            <Td>
              <Badge 
                colorScheme={course.status === 'Đang hoạt động' ? 'green' : 'red'}
                px={2}
                py={1}
              >
                {course.status}
              </Badge>
            </Td>
            <Td>
              <HStack spacing={2}>
                <IconButton
                  aria-label="Information"
                  icon={<Icon as={FiInfo} />}
                  size="sm"
                  variant="ghost"
                />
                <IconButton
                  aria-label="Edit"
                  icon={<Icon as={FiEdit2} />}
                  size="sm"
                  variant="ghost"
                />
                <IconButton
                  aria-label="Delete"
                  icon={<Icon as={FiTrash2} />}
                  size="sm"
                  variant="ghost"
                />
              </HStack>
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};