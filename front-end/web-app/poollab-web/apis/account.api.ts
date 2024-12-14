interface AccountResponse {
  status: number;
  message: string;
  data: any;
}

const BASE_URL = 'https://poollabwebapi20241008201316.azurewebsites.net/api';

export const accountApi = {
  getAccountById: async (accountId: string): Promise<AccountResponse> => {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${BASE_URL}/Account/GetAccountByID/${accountId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.json();
  },

  updateInfo: async (accountId: string, data: {
    email: string;
    avatarUrl: string;
    userName: string;
    fullName: string;
    phoneNumber: string;
  }): Promise<AccountResponse> => {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${BASE_URL}/Account/UpdateInfoUser/${accountId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      }
    );
    return response.json();
  },

  updatePassword: async (accountId: string, data: {
    oldPassword: string;
    newPassword: string;
  }): Promise<AccountResponse> => {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${BASE_URL}/Account/UpdatePassword/${accountId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      }
    );
    return response.json();
  },

  uploadAvatar: async (file: File): Promise<AccountResponse> => {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(
      `${BASE_URL}/account/uploadfileavatar`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );
    return response.json();
  },

  getAllRoles: async (): Promise<AccountResponse> => {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${BASE_URL}/role/getallrole`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.json();
  },
};