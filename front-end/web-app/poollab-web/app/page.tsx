'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Box,
  Container,
  FormControl,
  FormLabel,
  Input,
  VStack,
  useToast,
  Flex,
  Text,
} from '@chakra-ui/react';
import { authService } from '@/services/authService';
import { Button } from '@/app/components/ui/button';

export default function LoginPage() {
  const router = useRouter();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // Check authentication on mount
  useEffect(() => {
    if (authService.isAuthenticated()) {
      const path = authService.getRedirectPath();
      router.replace(path);
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (!formData.email || !formData.password) {
        throw new Error('Please enter email and password');
      }

      const response = await authService.login({
        email: formData.email,
        password: formData.password,
      });

      if (response.status === 200) {
        toast({
          title: 'Login successful',
          status: 'success',
          duration: 2000,
          isClosable: true,
        });

        // Get redirect path based on user role
        const path = authService.getRedirectPath();
        
        // Use Next.js router for client-side navigation
        router.push(path);
      }
    } catch (error) {
      toast({
        title: 'Login failed',
        description: error instanceof Error ? error.message : 'An error occurred',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      minH="100vh"
      w="100%"
      position="relative"
      bgImage="url('/logo/bg.jpg')"
      bgSize="cover"
      bgPosition="center"
      bgRepeat="no-repeat"
    >
      <Box position="absolute" inset="0" bg="blackAlpha.600" />
      
      {/* Centered Container */}
      <Flex 
        position="relative" 
        minH="100vh" 
        alignItems="center" 
        justifyContent="center"
      >
        <Box 
          w="100%" 
          maxW="400px" 
          mx={4}
          p={8} 
          borderWidth={1} 
          borderRadius="lg" 
          boxShadow="lg"
          bg="white"
        >
          {/* Logo Section */}
          <Flex direction="column" alignItems="center" mb={6}>
            <Box position="relative" w="120px" h="120px" mb={4}>
              <Image
                src="/logo/logo01.png"
                alt="PoolLab Logo"
                layout="fill"
                objectFit="contain"
                priority
              />
            </Box>
            <Text fontSize="2xl" fontWeight="bold" mb={2}>
              Chào mừng đến với PoolLab
            </Text>
          </Flex>

          <form onSubmit={handleLogin}>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    email: e.target.value
                  }))}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    password: e.target.value
                  }))}
                />
              </FormControl>

              <Button 
                className="w-full"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </Button>
            </VStack>
          </form>
        </Box>
      </Flex>
    </Box>
  );
}