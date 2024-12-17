const BASE_URL = 'https://poollabwebapi20241008201316.azurewebsites.net/api';

export const feedbackApi = {
  getAllFeedback: async (params: {
    CusName?: string;
    StoreId?: string;
    SortBy: number;
    SortAscending: boolean;
  }) => {
    const token = localStorage.getItem('token');
    const queryString = new URLSearchParams({
      ...(params.CusName && { CusName: params.CusName }),
      ...(params.StoreId && { StoreId: params.StoreId }),
      SortBy: params.SortBy.toString(),
      SortAscending: params.SortAscending.toString()
    }).toString();

    const response = await fetch(
      `${BASE_URL}/review/getallreview?${queryString}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.json();
  }
};