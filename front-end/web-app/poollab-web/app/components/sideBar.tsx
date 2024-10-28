// components/Sidebar.tsx
"use client";

import { 
  Box, 
  VStack, 
  Icon, 
  Link, 
  Flex,
  Text,
  Image,
  useColorModeValue
} from '@chakra-ui/react';
import { 
  FiHome,
  FiTrendingUp,
  FiUsers,
  FiBox,
  FiShoppingCart,
  FiFileText,
  FiSettings,
  FiMessageSquare
} from 'react-icons/fi';
import { IconType } from 'react-icons'; // Thêm import này

// Sửa lại interface NavItemProps
interface NavItemProps {
  icon: IconType;
  children: React.ReactNode;
  isActive?: boolean;
}

// Sửa lại cách định nghĩa NavItem component
const NavItem = ({ icon, children, isActive }: NavItemProps) => {
  const activeBg = useColorModeValue('blue.50', 'blue.800');
  const activeColor = useColorModeValue('blue.600', 'blue.200');
  const inactiveColor = useColorModeValue('gray.600', 'gray.400');

  return (
    <Link
      style={{ textDecoration: 'none' }}
      _focus={{ boxShadow: 'none' }}
    >
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
    </Link>
  );
};

export default function Sidebar() {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box
      bg={bgColor}
      borderRight="1px"
      borderRightColor={borderColor}
      w="64"
      pos="fixed"
      h="full"
    >
      {/* Logo Section */}
      <Flex h="40" alignItems="center" mx="8" justifyContent="space-between">
  <Image 
    src="/logo/logo01.png"
    alt="Logo"
    h="full"    
    w="full"    
    objectFit="contain"
  />
</Flex>

      {/* Navigation Items */}
      <VStack spacing="0" align="stretch" mt="4">
        <NavItem icon={FiHome} isActive={true}>
          Trang Chủ
        </NavItem>
        <NavItem icon={FiTrendingUp} isActive={false}>
          Analytics
        </NavItem>
        <NavItem icon={FiUsers} isActive={false}>
          Người dùng
        </NavItem>
        <NavItem icon={FiBox} isActive={false}>
          Sản Phẩm
        </NavItem>
        <NavItem icon={FiShoppingCart} isActive={false}>
          Orders
        </NavItem>
        <NavItem icon={FiFileText} isActive={false}>
          Documents
        </NavItem>
        <NavItem icon={FiMessageSquare} isActive={false}>
          Messages
        </NavItem>
        <NavItem icon={FiSettings} isActive={false}>
          Cài đặt
        </NavItem>
      </VStack>
    </Box>
  );
}