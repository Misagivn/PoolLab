import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@chakra-ui/react';
import { authApi } from '@/apis/auth.api';
import { decodeJWT } from '@/helpers/jwt.helper';
import { AUTH_ROUTES, AUTH_MESSAGES } from '@/utils/constants';

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const toast = useToast();

  const handleRoleNavigation = (decodedToken: any) => {
    const role = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

    switch (role) {
      case 'Staff':
        if (decodedToken.storeId) {
          router.push(AUTH_ROUTES.STAFF);
        } else {
          throw new Error(AUTH_MESSAGES.INVALID_STORE_STAFF);
        }
        break;
      case 'Manager':
        if (decodedToken.storeId) {
          router.push(AUTH_ROUTES.MANAGER);
        } else {
          throw new Error(AUTH_MESSAGES.INVALID_STORE_MANAGER);
        }
        break;
      case 'Super Manager':
          router.push(AUTH_ROUTES.SUPER_MANAGER);
        break;
      case 'Admin':
          router.push(AUTH_ROUTES.ADMIN);
        break;
      default:
        throw new Error(AUTH_MESSAGES.INVALID_ROLE);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError('');

    try {
      const data = await authApi.login(email, password);

      if (data.status === 200) {
        localStorage.setItem('token', data.data);
        
        try {
          const decodedToken = decodeJWT(data.data);
          handleRoleNavigation(decodedToken);

          sessionStorage.setItem("username", decodedToken.username);
          if (decodedToken.storeId && decodedToken.storeId.trim() !== "") {
            sessionStorage.setItem("storeId", decodedToken.storeId);
          }
          
          toast({
            title: AUTH_MESSAGES.LOGIN_SUCCESS,
            description: data.message,
            status: 'success',
            duration: 1000,
            isClosable: true,
          });
        } catch (decodeError) {
          console.error('Token decode error:', decodeError);
          setError(AUTH_MESSAGES.INVALID_TOKEN);
        }
      } else {
        setError(data.message || AUTH_MESSAGES.LOGIN_FAILED);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(AUTH_MESSAGES.GENERIC_ERROR);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    login,
    isLoading,
    error,
  };
};