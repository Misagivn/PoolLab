"use client";

import { Box, Flex } from '@chakra-ui/react';
import Sidebar from '@/components/shared/sidebar';

export default function ManagerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Flex minH="100vh">
      <Sidebar />
      <Box flex="1" ml="250px" bg="gray.50" p="6">
        {children}
      </Box>
    </Flex>
  );
}