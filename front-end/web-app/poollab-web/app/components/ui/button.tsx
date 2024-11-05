'use client';

import { Button as ChakraButton, ButtonProps } from '@chakra-ui/react';

interface CustomButtonProps extends ButtonProps {
  isLoading?: boolean;
}

export function Button({
  children,
  isLoading,
  ...props
}: CustomButtonProps) {
  return (
    <ChakraButton
      type="submit"
      colorScheme="blue"
      width="full"
      size="lg"
      mt={6}
      isLoading={isLoading}
      loadingText="Loading..."
      {...props}
    >
      {children}
    </ChakraButton>
  );
}