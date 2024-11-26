"use client";

import { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Text,
  useToast,
  Container,
  Image,
  FormErrorMessage,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
//import styles from "./LoginPage.module.css";

interface LoginResponse {
  status: number;
  message: string;
  data: string;
}

interface JWTPayload {
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": string;
  storeId?: string;
  companyId?: string;
}

function decodeJWT(token: string): JWTPayload {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    throw new Error("Invalid token format");
  }
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const toast = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(
        "https://poollabwebapi20241008201316.azurewebsites.net/api/Auth/LoginStaff",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data: LoginResponse = await response.json();

      if (data.status === 200) {
        localStorage.setItem("token", data.data);

        try {
          const decodedToken = decodeJWT(data.data);
          const role =
            decodedToken[
              "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
            ];

          switch (role) {
            case "Staff":
              router.push("/booktable");
              break;
            case "Manager":
              router.push("/manager");
              break;
            case "Super Manager":
              router.push("/supermanager");
              break;
            case "Admin":
              router.push("/dashboard");
              break;
            default:
              setError("Invalid role");
          }

          toast({
            title: "Đăng nhập thành công",
            description: data.message,
            status: "success",
            duration: 1000,
            isClosable: true,
          });
        } catch (decodeError) {
          console.error("Token decode error:", decodeError);
          setError("Invalid token format");
        }
      } else {
        setError(data.message || "Đăng nhập thất bại");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Đã xảy ra lỗi trong quá trình đăng nhập");
    } finally {
      setIsLoading(false);
    }
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

          <form onSubmit={handleLogin}>
            <VStack spacing={6}>
              <FormControl isRequired isInvalid={!!error}>
                <FormLabel color="#4A5568">Email</FormLabel>
                <Input
                  type="email"
                  placeholder="Email của bạn"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  onChange={(e) => setPassword(e.target.value)}
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
      </Box>
    </Box>
    //  <div className={styles.backgroundContainer}>
    //       <div className={styles.wrapper}>
    //         <form onSubmit={handleLogin}>
    //           <h1>Đăng Nhập</h1>

    //           <div className={styles.input_box}>
    //             <input
    //               type="text"
    //               placeholder="Email / Tên Đăng Nhập"
    //               value={email}
    //               onChange={(e) => setEmail(e.target.value)}
    //               required
    //             />
    //             <i className="bx bxs-user"></i>
    //           </div>

    //           <div className={styles.input_box}>
    //             <input
    //               type="password"
    //               placeholder="Mật Khẩu"
    //               value={password}
    //               onChange={(e) => setPassword(e.target.value)}
    //               required
    //             />
    //             <i className="bx bxs-lock-alt"></i>
    //           </div>

    //           <button type="submit" className={styles.btn}>
    //             Đăng Nhập
    //           </button>
    //         </form>
    //       </div>
    //     </div>
  );
}
