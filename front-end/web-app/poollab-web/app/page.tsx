'use client';

import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Alert,
  AlertIcon,
  AlertDescription,
  useToast,
  Heading,
  Flex,
  Image,
  Text,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

interface LoginResponse {
  status: number;
  message: string;
  data: string;
}

interface JWTPayload {
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': string;
  storeId?: string;
  companyId?: string;
}

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const toast = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('https://poollabwebapi20241008201316.azurewebsites.net/api/Auth/LoginStaff', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data: LoginResponse = await response.json();

      if (data.status === 200 && data.data) {
        localStorage.setItem('token', data.data);
        const decoded = jwtDecode(data.data) as JWTPayload;
        const role = decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

        toast({
          title: 'Login Successful',
          description: `Welcome back!`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });

        // Route based on role
        switch (role) {
          case 'Staff':
            router.push('/booktable');
            break;
          case 'Manager':
            if (decoded.storeId) {
              router.push('/manager');
            } else {
              setError('Invalid store ID for manager');
            }
            break;
          case 'Super Manager':
            if (decoded.companyId) {
              router.push('/supermanager');
            } else {
              setError('Invalid company ID for super manager');
            }
            break;
          case 'Admin':
            if (decoded.companyId) {
              router.push('/dashboard');
            } else {
              setError('Invalid company ID for admin');
            }
            break;
          default:
            setError('Invalid role');
        }
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred during login');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      minH="100vh"
      w="100%"
      bgImage="url('/logo/imgbg.jpg')"
      bgPosition="center"
      bgRepeat="no-repeat"
      bgSize="cover"
      position="relative"
    >
      <Flex
        minH="100vh"
        align="center"
        justify="center"
        p={4}
      >
        <Box
          bg="rgba(255, 255, 255, 0.1)"
          backdropFilter="blur(10px)"
          p={8}
          borderRadius="xl"
          boxShadow="lg"
          border="1px solid rgba(255, 255, 255, 0.2)"
          w={{ base: "90%", sm: "400px" }}
          maxW="450px"
        >
          <Stack spacing={6} align="center" mb={8}>
            <Image
              src="/logo/logo01.png"
              alt="PoolLab Logo"
              w="200px"
              h="auto"
            />
            <Heading
              color="white"
              fontSize="2xl"
              fontWeight="bold"
              textAlign="center"
            >
              Chào mừng đến với PoolLab
            </Heading>
          </Stack>

          <form onSubmit={handleLogin}>
            <Stack spacing={4}>
              <FormControl isRequired>
                <FormLabel color="white">Email</FormLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Nhập email của bạn"
                  bg="rgba(255, 255, 255, 0.1)"
                  border="1px solid rgba(255, 255, 255, 0.2)"
                  color="white"
                  _placeholder={{ color: "whiteAlpha.700" }}
                  _hover={{ borderColor: "whiteAlpha.400" }}
                  _focus={{ 
                    borderColor: "whiteAlpha.500",
                    bg: "rgba(255, 255, 255, 0.15)"
                  }}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel color="white">Mật khẩu</FormLabel>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nhập mật khẩu của bạn"
                  bg="rgba(255, 255, 255, 0.1)"
                  border="1px solid rgba(255, 255, 255, 0.2)"
                  color="white"
                  _placeholder={{ color: "whiteAlpha.700" }}
                  _hover={{ borderColor: "whiteAlpha.400" }}
                  _focus={{ 
                    borderColor: "whiteAlpha.500",
                    bg: "rgba(255, 255, 255, 0.15)"
                  }}
                />
              </FormControl>

              {error && (
                <Alert status="error" borderRadius="md" bg="rgba(255, 0, 0, 0.2)">
                  <AlertIcon />
                  <AlertDescription color="white">{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                bg="rgba(255, 255, 255, 0.15)"
                color="white"
                size="lg"
                fontSize="md"
                isLoading={isLoading}
                loadingText="Đang đăng nhập..."
                w="100%"
                mt={4}
                _hover={{
                  bg: "rgba(255, 255, 255, 0.25)"
                }}
                _active={{
                  bg: "rgba(255, 255, 255, 0.3)"
                }}
                backdropFilter="blur(5px)"
              >
                Đăng nhập
              </Button>
            </Stack>
          </form>
        </Box>
      </Flex>
    </Box>
  );
}