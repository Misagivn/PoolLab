export interface PlayTime {
  id: string;
  name: string; 
  billiardTableId: string;
  timeStart: string;
  timeEnd: string | null;
  totalTime: number;
  totalPrice: number;
  status: string;
}

export interface Order {
  id: string;
  orderCode: string;
  username: string;
  billiardTableId: string;
  storeId: string;
  orderDate: string;
  discount: number;
  totalPrice: number;
  status: string;
}

export interface OrderDetail {
  id: string;
  orderCode: string;
  username: string;
  billiardTableId: string;
  storeId: string;
  storeName: string;
  address: string;
  playTime: PlayTime;
  orderDetails: any[];
  orderDate: string;
  orderBy: string | null;
  discount: number;
  totalPrice: number;
  finalPrice: number | null;
  customerPay: number;
  excessCash: number;
  status: string;
}

export interface OrderResponse {
  status: number;
  message: string | null;
  data: {
    items: Order[];
    totalItem: number;
    pageSize: number;
    totalPages: number;
    pageNumber: number;
  };
}

export interface OrderDetailResponse {
  status: number;
  message: string | null;
  data: OrderDetail;
}