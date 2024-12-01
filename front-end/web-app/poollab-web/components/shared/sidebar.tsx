"use client";

import { 
  Box, 
  Flex, 
  Stack, 
  Text, 
  Icon,
  Link,
  useColorModeValue,
  Image,
  Container
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { routes } from '@/config/routes';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
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
      overflowY="auto"
      py="6"
    >
      <Box bg={bgColor} mb="8">
        <Container maxW="container.sm" px={6}>
          <Flex h="70px" alignItems="center" justifyContent="start" px="4">
            <Link as={NextLink} href="/manager/dashpage" width="full">
              <Image
                src="/logo/logo01.png" 
                alt="PoolLab Logo"
                h="full"
                mx="full"
                objectFit="contain"
              />
            </Link>
          </Flex>
        </Container>
      </Box>

      <Stack spacing="1">
        {routes.map((route) => {
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
                p="2"
                mx="2"
                borderRadius="md"
                cursor="pointer"
                bg={isActive ? 'blue.50' : 'transparent'}
                color={isActive ? 'blue.500' : 'gray.600'}
                _hover={{ bg: 'blue.50', color: 'blue.500' }}
              >
                <Icon fontSize="14" as={route.icon} mr="3" />
                <Text fontSize="sm">{route.label}</Text>
              </Flex>
            </Link>
          );
        })}
      </Stack>
    </Box>
  );
}