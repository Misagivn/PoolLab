import { SingleVoucherResponse, Voucher, VoucherResponse } from "@/utils/types/voucher.types";

const BASE_URL = 'https://poollabwebapi20241008201316.azurewebsites.net/api';

export const voucherApi = {
  getAllVouchers: async (page: number = 1, pageSize: number = 10): Promise<VoucherResponse> => {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${BASE_URL}/voucher/getallvoucher?SortBy=createdDate&SortAscending=false&PageNumber=${page}&PageSize=${pageSize}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.json();
  },

  getVoucherById: async (voucherId: string): Promise<SingleVoucherResponse> => {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${BASE_URL}/voucher/getvoucherbyid/${voucherId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.json();
  },

  createVoucher: async (data: Pick<Voucher, 'name' | 'description' | 'point' | 'discount'>): Promise<SingleVoucherResponse> => {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${BASE_URL}/voucher/addnewvoucher`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      }
    );
    return response.json();
  },

  updateVoucher: async (voucherId: string, data: Pick<Voucher, 'name' | 'description' | 'point' | 'discount'>): Promise<SingleVoucherResponse> => {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${BASE_URL}/voucher/updatevoucher/${voucherId}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      }
    );
    return response.json();
  },
  inactiveVoucher: async (voucherId: string): Promise<SingleVoucherResponse> => {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${BASE_URL}/voucher/inactivevoucher/${voucherId}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.json();
  },

  reactivateVoucher: async (voucherId: string): Promise<SingleVoucherResponse> => {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${BASE_URL}/voucher/reactivevoucher/${voucherId}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.json();
  }
};
