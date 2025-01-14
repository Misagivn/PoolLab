interface LoginResponse {
  status: number;
  message: string;
  data: string;
}


export const authApi = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_LOCAL_URL}/Auth/LoginStaff`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',  
      },
      body: JSON.stringify({ email, password })
    });
    return response.json();
  }
};