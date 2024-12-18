export interface ProductType {
  id: string;
  name: string;
  descript: string;
}

export interface ProductTypeResponse {
  status: number;
  message: string | null;
  data: ProductType[];
}