export interface Product {
  id: string;
  name: string;
  descript: string;
  quantity: number;
  minQuantity: number;
  price: number;
  productImg: string;
  productTypeId: string;
  productTypeName?: string;
  productGroupId: string;
  productGroupName?: string;
  unitId: string;
  unitName?: string;
  storeId: string;
  status: string;
  createdDate: string;
  updatedDate: string | null;
}

export interface CreateProductRequest {
  name: string;
  descript: string;
  quantity: number;
  minQuantity: number;
  price: number;
  productImg: string;
  productTypeId: string;
  productGroupId: string;
  storeId: string;
  unitId: string;
}

export interface UpdateProductRequest {
  name: string;
  descript: string;
  quantity: number;
  minQuantity: number;
  price: number;
  productImg: string;
  productTypeId: string;
  productGroupId: string;
  unitId: string;
  status: string;
}

export interface ProductResponse {
  status: number;
  message: string | null;
  data: Product[] | Product;
}