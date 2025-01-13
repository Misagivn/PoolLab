export interface ProductGroup {
  id: string;
  name: string;
  descript: string;
  productTypeId: string | null;
}

export interface ProductGroupResponse {
  status: number;
  message: string | null;
  data: ProductGroup[];
}