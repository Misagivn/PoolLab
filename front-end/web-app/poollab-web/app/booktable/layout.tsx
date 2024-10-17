// File: /app/table/layout.tsx
import React from 'react';
import { Flex } from '@chakra-ui/react';

export default function TableLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Flex h="100vh">
      {children}
    </Flex>
  );
}
