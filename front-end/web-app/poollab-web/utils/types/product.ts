export interface Product {
  id: string;
  name: string;
  descript: string;
  quantity: number;
  minQuantity: number;
  price: number;
  productImg: string;
  storeId: string;
  productTypeId: string;
  productTypeName?: string;
  productGroupId: string;
  groupName?: string;
  unitId: string;
  unitName?: string;
  createdDate: string;
  updatedDate: string | null;
  status: string;
}

export interface ProductResponse {
  status: number;
  message: string | null;
  data: {
    items: Product[];
    totalItem: number;
    pageSize: number;
    totalPages: number;
    pageNumber: number;
  };
}

export interface CreateProductPayload {
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

export interface UpdateProductPayload extends Omit<CreateProductPayload, 'storeId'> {
  status: string;
}

export interface JWTPayload {
  storeId: string;
  [key: string]: any;
}
