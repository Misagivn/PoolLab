"use client";

import { 
  Box, 
  VStack, 
  Icon, 
  Flex,
  Text,
  Image,
  useColorModeValue,
} from '@chakra-ui/react';
import { usePathname } from 'next/navigation';
import NextLink from 'next/link';
import { routes } from '@/config/routes';

interface NavItemProps {
  path: string;
  icon: IconType;
  children: React.ReactNode;
  isActive: boolean;
}

const NavItem = ({ path, icon, children, isActive }: NavItemProps) => {
  const activeBg = useColorModeValue('blue.50', 'blue.800');
  const activeColor = useColorModeValue('blue.600', 'blue.200');
  const inactiveColor = useColorModeValue('gray.600', 'gray.400');

  return (
    <NextLink href={path} passHref style={{ textDecoration: 'none' }}>
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        bg={isActive ? activeBg : 'transparent'}
        color={isActive ? activeColor : inactiveColor}
        _hover={{
          bg: activeBg,
          color: activeColor,
        }}
      >
        <Icon
          mr="4"
          fontSize="16"
          as={icon}
        />
        <Text fontSize="sm" fontWeight="medium">
          {children}
        </Text>
      </Flex>
    </NextLink>
  );
};

export default function Sidebar() {
  const pathname = usePathname();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const handleLogout = () => {
    // Implement logout logic here
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <Box
      bg={bgColor}
      borderRight="1px"
      borderRightColor={borderColor}
      w="64"
      pos="fixed"
      h="full"
    >
      <Flex h="40" alignItems="center" mx="8" justifyContent="space-between">
        <Image 
          src="/logo/logo01.png"
          alt="Logo"
          h="full"    
          w="full"    
          objectFit="contain"
        />
      </Flex>

      <VStack spacing="0" align="stretch" mt="4">
        {routes.map((route) => (
          route.path === '/logout' ? (
            <NavItem
              key={route.path}
              path={route.path}
              icon={route.icon}
              isActive={false}
              onClick={handleLogout}
            >
              {route.label}
            </NavItem>
          ) : (
            <NavItem
              key={route.path}
              path={route.path}
              icon={route.icon}
              isActive={pathname === route.path}
            >
              {route.label}
            </NavItem>
          )
        ))}
      </VStack>
    </Box>
  );
}