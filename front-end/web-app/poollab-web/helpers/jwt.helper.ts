export interface JWTPayload {
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': string;
  storeId?: string; 
  companyId?: string;
}

export const decodeJWT = (token: string): JWTPayload => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    throw new Error('Invalid token format');
  }
};