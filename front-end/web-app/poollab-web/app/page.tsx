'use client';

import { Box } from '@chakra-ui/react';
import { LoginForm } from '@/components/auth/LoginForm';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';

export default function Home() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <Box
      w="100vw"
      h="100vh"
      bgImage="url('/logo/bg.jpg')"
      bgPosition="center"
      bgRepeat="no-repeat"
      bgSize="cover"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Box
        p={8}
        maxWidth="md"
        borderRadius="lg"
        bg="rgba(255, 255, 255, 0.9)"
        backdropFilter="blur(10px)"
        boxShadow="lg"
      >
        <LoginForm
          email={email}
          password={password}
          error={error}
          isLoading={isLoading}
          onEmailChange={(e) => setEmail(e.target.value)}
          onPasswordChange={(e) => setPassword(e.target.value)}
          onSubmit={handleSubmit}
        />
      </Box>
    </Box>
  );
}