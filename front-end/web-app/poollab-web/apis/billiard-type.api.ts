const BASE_URL = 'https://poollabwebapi20241008201316.azurewebsites.net/api';
export const billiardTypeApi = {
  getAllTypes: async (token: string) => {
    try {
      const response = await fetch(
        `${BASE_URL}/BilliardType/GetAllBilliardType`,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      throw new Error('Failed to fetch types');
    }
  }
};