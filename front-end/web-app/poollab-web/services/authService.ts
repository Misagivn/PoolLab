import { jwtDecode } from 'jwt-decode';
import { JWTPayload, UserInfo } from '../types/auth';

class AuthService {
  private readonly TOKEN_KEY = 'token';

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }

  setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.TOKEN_KEY, token);
    }
  }

  removeToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.TOKEN_KEY);
    }
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const decoded = jwtDecode(token) as JWTPayload;
      return decoded.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }

  getUserRole(): string | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const decoded = jwtDecode(token) as JWTPayload;
      return decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
    } catch {
      return null;
    }
  }

  getUserInfo(): UserInfo | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const decoded = jwtDecode(token) as JWTPayload;
      return {
        accountId: decoded.accountId,
        username: decoded.username,
        fullName: decoded.fullName,
        role: decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'],
        storeId: decoded.storeId,
        companyId: decoded.companyId
      };
    } catch {
      return null;
    }
  }
}

export const authService = new AuthService();