export interface BilliardTable {
  id: string;
  name: string;
  descript: string;
  image: string;
  storeId: string;
  areaId: string;
  billiardTypeId: string;
  priceId: string;
  bidaTypeName: string;
  areaName: string;
  createdDate: string;
  updatedDate: string | null;
  status: string;
}

export interface Area {
  id: string;
  name: string;
  descript: string;
  areaImg: string;
  storeId: string;
}

export interface BilliardPrice {
  id: string;
  name: string;
  descript: string;
  oldPrice: number;
  newPrice: number;
  timeStart: string;
  timeEnd: string;
  status: string;
}

export interface BilliardType {
  id: string;
  name: string;
  descript: string;
  image: string;
}

export interface CreateTableData {
  name: string;
  descript: string;
  image: string;
  storeId: string;
  areaId: string;
  billiardTypeId: string;
  priceId: string;
}

export interface TableDetail {
  id: string;
  name: string;
  descript: string;
  image: string;
  storeId: string; 
  areaId: string;
  billiardTypeId: string;
  qrcode: string;
  priceId: string;
  createdDate: string;
  updatedDate: string | null;
  status: string;
  storeName: string;
  address: string;
  billiardTypeName: string;
  areaName: string;
  bidaPrice: number;
}

export interface UpdateTableData {
  name: string;
  descript: string;
  image: string;
  areaId: string;
  billiardTypeId: string;
  priceId: string;
}

export interface UpdateStatusData {
  status: string;
}

export interface TableFilters {
  searchQuery: string;
  statusFilter: string;
}

export interface ApiResponse<T> {
  status: number;
  message: string | null;
  data: T;
}