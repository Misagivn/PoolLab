export interface Store {
  id: string;
  name: string;
  address: string;
  storeImg: string;
  descript: string;
  phoneNumber: string;
  rated: number;
  timeStart: string | null;
  timeEnd: string | null;
  companyId: string | null;
  createdDate: string;
  updatedDate: string | null;
  status: string;
}

export interface StoreResponse {
  status: number;
  message: string | null;
  data: Store[] | Store;
}