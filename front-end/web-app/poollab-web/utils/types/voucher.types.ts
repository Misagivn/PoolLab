export interface Voucher {
  id: string;
  name: string;
  description: string;
  point: number;
  vouCode: string;
  discount: number;
  createdDate: string;
  updatedDate: string | null;
  status: string;
}

export interface VoucherResponse {
  status: number;
  message: string | null;
  data: {
    items: Voucher[];
    totalItem: number;
    pageSize: number;
    totalPages: number;
    pageNumber: number;
  };
}

export interface SingleVoucherResponse {
  status: number;
  message: string | null;
  data: Voucher;
}
