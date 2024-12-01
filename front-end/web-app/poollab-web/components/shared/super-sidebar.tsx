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
  Collapse, 
  Container
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import NextLink from 'next/link';
import { useState } from 'react';
import { superManagerRoutes } from '@/config/super-manager-routes';
import { usePathname } from 'next/navigation';

export default function SuperSidebar() {
  const pathname = usePathname();
  const bgColor = useColorModeValue('white', 'gray.800');
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});

  const toggleMenu = (label: string) => {
    setOpenMenus(prev => ({ ...prev, [label]: !prev[label] }));
  };

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
            <Link as={NextLink} href="/supermanager/dashpage" width="full">
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

      <Box pt="4">
        <Stack spacing="1">
          {superManagerRoutes.map((route) => {
            const isActive = pathname === route.path;
            const hasSubRoutes = route.subRoutes && route.subRoutes.length > 0;
            const isOpen = openMenus[route.label];

            return (
              <Box key={route.path}>
                {hasSubRoutes ? (
                  <Flex
                    align="center"
                    p="2"
                    mx="2"
                    borderRadius="md"
                    cursor="pointer"
                    bg={isActive ? 'blue.50' : 'transparent'}
                    color={isActive ? 'blue.500' : 'gray.600'}
                    onClick={() => toggleMenu(route.label)}
                    _hover={{ bg: 'blue.50', color: 'blue.500' }}
                  >
                    <Icon fontSize="14" as={route.icon} mr="3" />
                    <Text fontSize="sm">{route.label}</Text>
                    <ChevronDownIcon
                      ml="auto"
                      transform={isOpen ? 'rotate(180deg)' : undefined}
                      transition="transform 0.2s"
                    />
                  </Flex>
                ) : (
                  <Link
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
                )}

                {hasSubRoutes && (
                  <Collapse in={isOpen}>
                    <Stack pl="8" mt="1">
                      {route.subRoutes?.map((subRoute) => (
                        <Link
                          key={subRoute.path}
                          as={NextLink}
                          href={subRoute.path}
                          _hover={{ textDecoration: 'none' }}
                        >
                          <Flex
                            p="2"
                            borderRadius="md"
                            cursor="pointer"
                            bg={pathname === subRoute.path ? 'blue.50' : 'transparent'}
                            color={pathname === subRoute.path ? 'blue.500' : 'gray.600'}
                            _hover={{ bg: 'blue.50', color: 'blue.500' }}
                          >
                            <Text fontSize="sm">{subRoute.label}</Text>
                          </Flex>
                        </Link>
                      ))}
                    </Stack>
                  </Collapse>
                )}
              </Box>
            );
          })}
        </Stack>
      </Box>
    </Box>
  );
}