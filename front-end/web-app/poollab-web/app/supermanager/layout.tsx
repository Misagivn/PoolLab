"use client";

import { Box, Flex } from '@chakra-ui/react';
import SuperSidebar from '@/components/shared/super-sidebar';
import SuperProviders from './super-providers';

export default function SuperManagerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SuperProviders>
      <Flex minH="100vh">
        <SuperSidebar />
        <Box flex="1" ml="250px" bg="gray.50" p="6">
          {children}
        </Box>
      </Flex>
    </SuperProviders>
  );
}