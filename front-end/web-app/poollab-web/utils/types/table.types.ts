export interface BilliardTable {
  id: string;
  name: string;
  descript: string | null;
  image: string | null;
  storeId: string;
  areaId: string;
  billiardTypeId: string;
  priceId: string;
  qrcode: string;
  bidaTypeName: string;
  areaName: string;
  oldPrice: number;
  createdDate: string;
  updatedDate: string | null;
  status: string;
}

export interface BilliardTableFormData {
  name: string;
  descript: string;
  image: string;
  areaId: string;
  billiardTypeId: string;
  priceId: string;
  // storeId?: string;
}