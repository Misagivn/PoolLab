"use client";

import { ChakraProvider } from '@chakra-ui/react';
import Sidebar from '@/app/components/shared/sidebar';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ChakraProvider>
          {children}
        </ChakraProvider>
      </body>
    </html>
  );
}