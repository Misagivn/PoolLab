// "use client"
// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import {
//   Box,
//   Container,
//   FormControl,
//   FormLabel,
//   Input,
//   VStack,
//   useToast,
// } from '@chakra-ui/react';
// import SelectStore from '@/app/components/login/SelectStore';
// import SelectCompany from '@/app/components/login/SelectCompany';
// import { authApi } from '../lib/auth';
// import { Button } from './components/button';
// import { LoginResponse } from '@/lib/types';
// // import { UserRole } from '../lib/types';

// export default function LoginPage() {
//   const router = useRouter();
//   const toast = useToast();
//   const [isLoading, setIsLoading] = useState(false);

//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//     storeId: '',
//     companyId: ''
//   });

//   const handleRouteByRole = (role: string) => {
//     switch (role) {
//       case 'staff':
//         router.push('/booktable');
//         break;
//       case 'manager':
//         router.push('/table');
//         break;
//       case 'supermanager':
//       case 'admin':
//         router.push('/DashBoard');
//         break;
//       default:
//         // Fallback route nếu không match role nào
//         router.push('/');
//         break;
//     }
//   };

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);

//     try {
//       if (!formData.email || !formData.password || !formData.storeId) {
//         throw new Error('Please fill in all required fields');
//       }

//       const loginPayload = {
//         email: formData.email,
//         password: formData.password,
//         storeId: formData.storeId,
//         companyId: formData.companyId || null
//       };

//       const response = await authApi.login(loginPayload);
//       const data = response.data as LoginResponse;

//       // Lưu thông tin vào localStorage
//       localStorage.setItem('token', data.token);
//       localStorage.setItem('role', data.role);
//       localStorage.setItem('storeId', formData.storeId);
//       if (formData.companyId) {
//         localStorage.setItem('companyId', formData.companyId);
//       }

//       toast({
//         title: 'Login successful',
//         status: 'success',
//         duration: 3000
//       });

//       // Điều hướng dựa trên role
//       handleRouteByRole(data.role);

//     } catch (error) {
//       toast({
//         title: 'Login failed',
//         description: error instanceof Error ? error.message : 'An error occurred',
//         status: 'error',
//         duration: 3000
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <Container maxW="container.sm" py={10}>
//       <Box p={8} borderWidth={1} borderRadius="lg" boxShadow="lg">
//         <form onSubmit={handleLogin}>
//           <VStack spacing={4}>
//             <FormControl isRequired>
//               <FormLabel>Email</FormLabel>
//               <Input
//                 type="email"
//                 value={formData.email}
//                 onChange={(e) => setFormData(prev => ({
//                   ...prev,
//                   email: e.target.value
//                 }))}
//               />
//             </FormControl>

            // <FormControl isRequired>
            //   <FormLabel>Password</FormLabel>
            //   <Input
            //     type="password"
            //     value={formData.password}
            //     onChange={(e) => setFormData(prev => ({
            //       ...prev,
            //       password: e.target.value
            //     }))}
            //   />
            // </FormControl>

//             <FormControl isRequired>
//               <FormLabel>Store</FormLabel>
//               <SelectStore
//                 value={formData.storeId}
//                 onChange={(value) => setFormData(prev => ({
//                   ...prev,
//                   storeId: value
//                 }))}
//               />
//             </FormControl>

//             <FormControl>
//               <FormLabel>Company (Optional)</FormLabel>
//               <SelectCompany
//                 value={formData.companyId}
//                 onChange={(value) => setFormData(prev => ({
//                   ...prev,
//                   companyId: value
//                 }))}
//               />
//             </FormControl>

//             <Button isLoading={isLoading}>
//               Login
//             </Button>
//           </VStack>
//         </form>
//       </Box>
//     </Container>
//   );
// }


import { useRouter } from "next/navigation";
import styles from "./LoginPage.module.css";
import { useState } from "react";
import jwt_decode from 'jwt-decode';  
import toast from 'react-hot-toast';

export default function LoginPage() {

  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const api_url = process.env.NEXT_PUBLIC_API_URL


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch('${api_url}/Auth/LoginStaff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        throw new Error('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin!')
      }

      const data = await response.json()
      const token = data.token
      
      // Giải mã token để lấy thông tin
      const decoded: { role: string; id: string } = jwt_decode(token)
      
      // Lưu thông tin vào session storage
      sessionStorage.setItem('token', token)
      sessionStorage.setItem('role', decoded.role)
      sessionStorage.setItem('id', decoded.id)
      
      // Điều hướng đến trang chính sau khi đăng nhập thành công
      router.push('/dashboard')
    } catch (error: any) {
      // Hiển thị thông báo lỗi bằng toast
      toast.error(error.message || 'Đã xảy ra lỗi khi đăng nhập!')
    }
  }

  return (

    <div className={styles.backgroundContainer}>  

      <div className={styles.wrapper}>
        <form onSubmit={handleLogin}>
          <h1>Đăng Nhập</h1>

          <div className={styles.input_box}>
            <input type="text" placeholder="Email / Tên Đăng Nhập" required />
            <i className="bx bxs-user"></i>
          </div>

          <div className={styles.input_box}>
            <input type="password" placeholder="Mật Khẩu" required />
            <i className="bx bxs-lock-alt"></i>
          </div>

          <button type="submit" className={styles.btn}>
            Đăng Nhập
          </button>
        </form>
      </div>
    </div>
  );
}
