"use client";

import { 
  Box, 
  Flex, 
  Stack, 
  Text, 
  Icon,
  Link,
  useColorModeValue,
  Image 
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { superManagerRoutes } from '@/config/super-manager-routes';
import { usePathname } from 'next/navigation';

export default function SuperSidebar() {
  const pathname = usePathname();
  const bgColor = useColorModeValue('white', 'gray.800');

  return (
    <Box
      bg={bgColor}
      w="250px"
      h="100vh"
      position="fixed"
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
    >
      {/* Logo */}
      <Flex h="20" alignItems="center" px="8">
        <Link as={NextLink} href="/supermanager/dashpage" _hover={{ textDecoration: 'none' }}>
          <Image
            src="/logo/logo01.png" 
            alt="PoolLab Logo"
            h="360px"
            objectFit="contain"
          />
        </Link>
      </Flex>

      <Stack spacing="1" px="4">
        {superManagerRoutes.map((route) => {
          const isActive = pathname === route.path;
          return (
            <Link
              key={route.path}
              as={NextLink}
              href={route.path}
              _hover={{ textDecoration: 'none' }}
            >
              <Flex
                align="center"
                p="4"
                mx="4"
                borderRadius="lg"
                role="group"
                cursor="pointer"
                bg={isActive ? 'blue.50' : 'transparent'}
                color={isActive ? 'blue.500' : 'gray.600'}
                _hover={{
                  bg: 'blue.50',
                  color: 'blue.500',
                }}
              >
                <Icon
                  mr="4"
                  fontSize="16"
                  as={route.icon}
                />
                <Text>{route.label}</Text>
              </Flex>
            </Link>
          );
        })}
      </Stack>
    </Box>
  );
}