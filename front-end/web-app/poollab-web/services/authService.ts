import axios from 'axios';
import Cookies from 'js-cookie';

interface LoginPayload {
  email: string;
  password: string;
}

interface LoginResponse {
  status: number;
  message: string;
  data: string; // JWT token
}

interface JWTPayload {
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': string;
  AccountId: string;
  Username: string[];
  exp: number;
}

class AuthService {
  private readonly BASE_URL = 'https://poollabwebapi20241008201316.azurewebsites.net/api';
  
  constructor() {
    if (typeof window !== 'undefined') {
      // Handle tab/browser close
      window.addEventListener('beforeunload', () => {
        this.cleanup();
      });

      // Handle tab visibility change
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
          this.cleanup();
        }
      });

      // Setup storage event listener to sync logout across tabs
      window.addEventListener('storage', (event) => {
        if (event.key === 'logout-event') {
          this.cleanup();
        }
      });
    }
  }

  private cleanup() {
    // Clear all auth related cookies
    Cookies.remove('auth-token');
    Cookies.remove('user-role');
    Cookies.remove('account-id');
    Cookies.remove('username');
    
    // Clear localStorage
    localStorage.clear();
    
    // Notify other tabs
    localStorage.setItem('logout-event', Date.now().toString());
    localStorage.removeItem('logout-event');
  }

  private decodeToken(token: string): JWTPayload {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Token decode error:', error);
      throw new Error('Invalid token format');
    }
  }

  private setSession(token: string, userData: JWTPayload) {
    try {
      // Set cookies with appropriate options
      Cookies.set('auth-token', token, { sameSite: 'strict' });
      Cookies.set('user-role', userData['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'], { sameSite: 'strict' });
      Cookies.set('account-id', userData.AccountId, { sameSite: 'strict' });
      Cookies.set('username', userData.Username[0], { sameSite: 'strict' });
      
      // Also store in localStorage for client-side access
      localStorage.setItem('token', token);
      localStorage.setItem('role', userData['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']);
      localStorage.setItem('accountId', userData.AccountId);
      localStorage.setItem('username', userData.Username[0]);
    } catch (error) {
      console.error('Error setting session:', error);
      throw new Error('Failed to set session data');
    }
  }

  async login(credentials: LoginPayload): Promise<LoginResponse> {
    try {
      const response = await axios.post<LoginResponse>(
        `${this.BASE_URL}/Auth/LoginStaff`,
        {
          ...credentials,
          storeId: "8a78e8ab-2e80-4042-bf08-e205672f5464"
        }
      );

      if (response.data.status === 200 && response.data.data) {
        const token = response.data.data;
        try {
          const decodedToken = this.decodeToken(token);
          this.setSession(token, decodedToken);
          return response.data;
        } catch (error) {
          console.error('Token processing error:', error);
          throw new Error('Invalid token received from server');
        }
      }

      throw new Error(response.data.message || 'Login failed');
    } catch (error) {
      console.error('Login error:', error);
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Network error occurred');
      }
      throw error;
    }
  }

  isAuthenticated(): boolean {
    return !!Cookies.get('auth-token');
  }

  getRole(): string | null {
    return Cookies.get('user-role') || null;
  }

  getRedirectPath(): string {
    const role = this.getRole()?.toLowerCase();
    switch (role) {
      case 'staff':
        return '/booktable';
      case 'manager':
        return '/manager/dashpage';
      case 'admin':
        return '/dashboard';
      default:
        return '/';
    }
  }

  logout() {
    this.cleanup();
    window.location.href = '/';
  }
}

export const authService = new AuthService();