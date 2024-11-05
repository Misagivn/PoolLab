"use client";

import { Box, Flex } from '@chakra-ui/react';
import Sidebar from '@/app/components/shared/sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Flex minH="100vh">
      <Sidebar />
      <Box flex="1" ml="64" p="6">
        {children}
      </Box>
    </Flex>
  );
}