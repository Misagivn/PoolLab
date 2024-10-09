"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  Link,
  Flex,
  useToast,
  FormErrorMessage,
} from "@chakra-ui/react";

const LoginSignupCard = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const toast = useToast();
  const router = useRouter();

  const validateEmail = (email) => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    if (newEmail && !validateEmail(newEmail)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      const endpoint = isLogin
        ? "https://poollabwebapi20241008201316.azurewebsites.net/api/Auth/Login"
        : "https://poollabwebapi20241008201316.azurewebsites.net/api/Auth/Register";
      const payload = isLogin
        ? { email, password }
        : { email, password, username, fullName };

      const response = await axios.post(endpoint, payload);

      toast({
        title: isLogin ? "Login Successful" : "Signup Successful",
        description: response.data.message,
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      if (isLogin) {
        // Redirect to home page after successful login
        router.push("/home");
      } else {
        // For signup, you might want to automatically log the user in,
        // or redirect them to the login page, or keep them on the current page
        setIsLogin(true);
        setEmail("");
        setPassword("");
        setUsername("");
        setFullName("");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "An error occurred",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Flex minHeight="100vh" width="full" align="center" justifyContent="center">
      <Box
        borderWidth={1}
        px={4}
        width="full"
        maxWidth="500px"
        borderRadius={4}
        textAlign="center"
        boxShadow="lg"
      >
        <Box p={4}>
          <VStack spacing={8} align="stretch">
            <Heading>{isLogin ? "Login" : "Sign Up"}</Heading>
            <form onSubmit={handleSubmit}>
              <VStack spacing={4} align="stretch">
                <FormControl isRequired isInvalid={!!emailError}>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                  />
                  <FormErrorMessage>{emailError}</FormErrorMessage>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Password</FormLabel>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </FormControl>
                {!isLogin && (
                  <>
                    <FormControl isRequired>
                      <FormLabel>Username</FormLabel>
                      <Input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel>Full Name</FormLabel>
                      <Input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                      />
                    </FormControl>
                  </>
                )}
                <Button
                  type="submit"
                  colorScheme="blue"
                  isLoading={isLoading}
                  loadingText={isLogin ? "Logging in" : "Signing up"}
                  isDisabled={!!emailError}
                >
                  {isLogin ? "Login" : "Sign Up"}
                </Button>
              </VStack>
            </form>
            <Text>
              {isLogin
                ? "Don't have an account? "
                : "Already have an account? "}
              <Link color="blue.500" onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? "Sign Up" : "Login"}
              </Link>
            </Text>
          </VStack>
        </Box>
      </Box>
    </Flex>
  );
};

export default LoginSignupCard;
