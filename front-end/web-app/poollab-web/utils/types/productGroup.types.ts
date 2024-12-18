export interface ProductGroup {
  id: string;
  name: string;
  descript: string;
}

export interface ProductGroupResponse {
  status: number;
  message: string | null;
  data: ProductGroup[];
}