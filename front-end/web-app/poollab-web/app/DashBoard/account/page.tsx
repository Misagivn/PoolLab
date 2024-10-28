'use client'

import { useState, useRef } from 'react';
import {
  Box,
  Button,
  FormControl,
  Input,
  VStack,
  Container,
  Heading,
  useToast,
  FormErrorMessage,
  Card,
  CardBody,
  Image as ChakraImage,
  IconButton,
  SimpleGrid,
  Center,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Upload, X } from 'lucide-react';

// Schema remains the same
const createAccountSchema = z.object({
  email: z.string().email('Invalid email address'),
  passwordHash: z.string().min(6, 'Password must be at least 6 characters'),
  userName: z.string().min(3, 'Username must be at least 3 characters'),
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  phoneNumber: z.string().regex(/^\+?[0-9]{10,}$/, 'Invalid phone number'),
  roleName: z.string().min(1, 'Role is required'),
  storeId: z.string().uuid('Invalid store ID'),
  companyId: z.string().uuid('Invalid company ID'),
});

type CreateAccountForm = z.infer<typeof createAccountSchema>;

export default function CreateAccountPage() {
  // State and handlers remain the same
  const [isLoading, setIsLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateAccountForm>({
    resolver: zodResolver(createAccountSchema),
  });

  // Handlers remain the same
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Invalid file type',
          description: 'Please upload an image file',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'File too large',
          description: 'Please upload an image smaller than 5MB',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      setAvatarFile(file);
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
    }
  };

  const removeAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const onSubmit = async (data: CreateAccountForm) => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
      });
      
      if (avatarFile) {
        formData.append('avatarFile', avatarFile);
      }
      
      const response = await fetch('https://poollabwebapi20241008201316.azurewebsites.net/api/Account/CreateNewAccount', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to create account');
      }

      toast({
        title: 'Account created successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      removeAvatar();
    } catch (error) {
      toast({
        title: 'Error creating account',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
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
      position="relative"
      h="100vh"
      backgroundImage="url('/assets/cr.jpg')"
      backgroundSize="cover"
      backgroundPosition="center"
      overflow="hidden"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Container maxW="900px" h="auto" py={4}>
        <Card
          bg="rgba(255, 255, 255, 0.1)"
          backdropFilter="blur(20px)"
          borderRadius="2xl"
          boxShadow="0 8px 32px 0 rgba(31, 38, 135, 0.37)"
          border="1px solid rgba(255, 255, 255, 0.18)"
        >
          <CardBody p={6}>
            <VStack spacing={4}>
              <Heading size="lg" color="white" mb={2}>Create New Account</Heading>
              
              <Box as="form" onSubmit={handleSubmit(onSubmit)} w="100%">
                <VStack spacing={4}>
                  {/* Avatar Section */}
                  <Center mb={2}>
                    <Box position="relative">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        accept="image/*"
                        style={{ display: 'none' }}
                      />
                      {avatarPreview ? (
                        <Box position="relative" w="100px" h="100px">
                          <ChakraImage
                            src={avatarPreview}
                            alt="Avatar preview"
                            borderRadius="full"
                            objectFit="cover"
                            w="100%"
                            h="100%"
                            border="3px solid"
                            borderColor="#00FFA9"
                          />
                          <IconButton
                            aria-label="Remove avatar"
                            icon={<X size={16} />}
                            size="xs"
                            bg="#00FFA9"
                            color="black"
                            _hover={{ bg: '#00E699' }}
                            position="absolute"
                            top={-2}
                            right={-2}
                            rounded="full"
                            onClick={removeAvatar}
                          />
                        </Box>
                      ) : (
                        <Button
                          leftIcon={<Upload size={16} />}
                          onClick={() => fileInputRef.current?.click()}
                          size="sm"
                          bg="#00FFA9"
                          color="black"
                          _hover={{ bg: '#00E699' }}
                        >
                          Upload Avatar
                        </Button>
                      )}
                    </Box>
                  </Center>

                  {/* Form Fields in Grid */}
                  <SimpleGrid columns={2} spacing={4} w="100%">
                    <FormControl isInvalid={!!errors.email}>
                      <Input
                        size="sm"
                        type="email"
                        {...register('email')}
                        placeholder="Email"
                        bg="rgba(255, 255, 255, 0.05)"
                        color="white"
                        border="1px solid rgba(255, 255, 255, 0.2)"
                        _hover={{ borderColor: '#00FFA9' }}
                        _focus={{ borderColor: '#00FFA9', boxShadow: '0 0 0 1px #00FFA9' }}
                      />
                      <FormErrorMessage fontSize="xs">{errors.email?.message}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={!!errors.passwordHash}>
                      <Input
                        size="sm"
                        type="password"
                        {...register('passwordHash')}
                        placeholder="Password"
                        bg="rgba(255, 255, 255, 0.05)"
                        color="white"
                        border="1px solid rgba(255, 255, 255, 0.2)"
                        _hover={{ borderColor: '#00FFA9' }}
                        _focus={{ borderColor: '#00FFA9', boxShadow: '0 0 0 1px #00FFA9' }}
                      />
                      <FormErrorMessage fontSize="xs">{errors.passwordHash?.message}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={!!errors.userName}>
                      <Input
                        size="sm"
                        {...register('userName')}
                        placeholder="Username"
                        bg="rgba(255, 255, 255, 0.05)"
                        color="white"
                        border="1px solid rgba(255, 255, 255, 0.2)"
                        _hover={{ borderColor: '#00FFA9' }}
                        _focus={{ borderColor: '#00FFA9', boxShadow: '0 0 0 1px #00FFA9' }}
                      />
                      <FormErrorMessage fontSize="xs">{errors.userName?.message}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={!!errors.fullName}>
                      <Input
                        size="sm"
                        {...register('fullName')}
                        placeholder="Full Name"
                        bg="rgba(255, 255, 255, 0.05)"
                        color="white"
                        border="1px solid rgba(255, 255, 255, 0.2)"
                        _hover={{ borderColor: '#00FFA9' }}
                        _focus={{ borderColor: '#00FFA9', boxShadow: '0 0 0 1px #00FFA9' }}
                      />
                      <FormErrorMessage fontSize="xs">{errors.fullName?.message}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={!!errors.phoneNumber}>
                      <Input
                        size="sm"
                        {...register('phoneNumber')}
                        placeholder="Phone Number"
                        bg="rgba(255, 255, 255, 0.05)"
                        color="white"
                        border="1px solid rgba(255, 255, 255, 0.2)"
                        _hover={{ borderColor: '#00FFA9' }}
                        _focus={{ borderColor: '#00FFA9', boxShadow: '0 0 0 1px #00FFA9' }}
                      />
                      <FormErrorMessage fontSize="xs">{errors.phoneNumber?.message}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={!!errors.roleName}>
                      <Input
                        size="sm"
                        {...register('roleName')}
                        placeholder="Role"
                        bg="rgba(255, 255, 255, 0.05)"
                        color="white"
                        border="1px solid rgba(255, 255, 255, 0.2)"
                        _hover={{ borderColor: '#00FFA9' }}
                        _focus={{ borderColor: '#00FFA9', boxShadow: '0 0 0 1px #00FFA9' }}
                      />
                      <FormErrorMessage fontSize="xs">{errors.roleName?.message}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={!!errors.storeId}>
                      <Input
                        size="sm"
                        {...register('storeId')}
                        placeholder="Store ID"
                        bg="rgba(255, 255, 255, 0.05)"
                        color="white"
                        border="1px solid rgba(255, 255, 255, 0.2)"
                        _hover={{ borderColor: '#00FFA9' }}
                        _focus={{ borderColor: '#00FFA9', boxShadow: '0 0 0 1px #00FFA9' }}
                      />
                      <FormErrorMessage fontSize="xs">{errors.storeId?.message}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={!!errors.companyId}>
                      <Input
                        size="sm"
                        {...register('companyId')}
                        placeholder="Company ID"
                        bg="rgba(255, 255, 255, 0.05)"
                        color="white"
                        border="1px solid rgba(255, 255, 255, 0.2)"
                        _hover={{ borderColor: '#00FFA9' }}
                        _focus={{ borderColor: '#00FFA9', boxShadow: '0 0 0 1px #00FFA9' }}
                      />
                      <FormErrorMessage fontSize="xs">{errors.companyId?.message}</FormErrorMessage>
                    </FormControl>
                  </SimpleGrid>

                  <Button
                    type="submit"
                    bg="#00FFA9"
                    color="black"
                    _hover={{ bg: '#00E699' }}
                    isLoading={isLoading}
                    loadingText="Creating..."
                    w="100%"
                    size="sm"
                    mt={2}
                  >
                    Create Account
                  </Button>
                </VStack>
              </Box>
            </VStack>
          </CardBody>
        </Card>
      </Container>
    </Box>
  );
}