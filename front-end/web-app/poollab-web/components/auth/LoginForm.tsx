import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Text,
  Image,
  FormErrorMessage,
} from "@chakra-ui/react";

interface LoginFormProps {
  email: string;
  password: string;
  error: string;
  isLoading: boolean;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const LoginForm = ({
  email,
  password,
  error,
  isLoading,
  onEmailChange,
  onPasswordChange,
  onSubmit,
}: LoginFormProps) => {
  return (
    <VStack spacing={4} align="stretch">
      <Box textAlign="center" mb={4}>
        <Image
          src="/logo/logo01.png"
          alt="PoolLab Logo"
          width="180px"
          height="auto"
          margin="0 auto"
          mb={6}
        />
        <Text fontSize="2xl" fontWeight="bold" color="#2D3748">
          Chào mừng đến với PoolLab
        </Text>
      </Box>

      <form onSubmit={onSubmit}>
        <VStack spacing={6}>
          <FormControl isRequired isInvalid={!!error}>
            <FormLabel color="#4A5568">Tên Đăng Nhập</FormLabel>
            <Input
              type="text"
              placeholder="Tên đăng nhập của bạn"
              value={email}
              onChange={onEmailChange}
              bg="white"
              size="lg"
              borderRadius="md"
              _placeholder={{ color: "gray.400" }}
            />
          </FormControl>

          <FormControl isRequired isInvalid={!!error}>
            <FormLabel color="#4A5568">Mật khẩu</FormLabel>
            <Input
              type="password"
              placeholder="Mật khẩu của bạn"
              value={password}
              onChange={onPasswordChange}
              bg="white"
              size="lg"
              borderRadius="md"
              _placeholder={{ color: "gray.400" }}
            />
            {error && <FormErrorMessage>{error}</FormErrorMessage>}
          </FormControl>

          <Button
            type="submit"
            width="100%"
            size="lg"
            bg="#3182CE"
            color="white"
            _hover={{ bg: "#2B6CB0" }}
            _active={{ bg: "#00FFA9" }}
            isLoading={isLoading}
            loadingText="Đang đăng nhập..."
            borderRadius="md"
            mt={4}
          >
            Đăng nhập
          </Button>
        </VStack>
      </form>
    </VStack>
  );
};
