export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

export interface DailyStats {
  date: string;
  totalIncome: number;
  totalOrder: number;
  totalBooking: number;
}