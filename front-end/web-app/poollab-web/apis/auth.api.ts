interface LoginResponse {
  status: number;
  message: string;
  data: string;
}

const AUTH_API_URL = 'https://poollabwebapi20241008201316.azurewebsites.net/api';

export const authApi = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await fetch(`${AUTH_API_URL}/Auth/LoginStaff`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',  
      },
      body: JSON.stringify({ email, password })
    });
    return response.json();
  }
};