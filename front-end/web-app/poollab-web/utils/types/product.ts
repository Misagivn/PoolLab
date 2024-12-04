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
  productTypeName: string;
  productGroupId: string;
  groupName: string;
  unitId: string;
  unitName: string;
  createdDate: string;
  updatedDate: string | null;
  status: string;
}

export interface CreateProductDTO {
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

export interface PaginatedResponse<T> {
  status: number;
  message: string | null;
  data: {
    items: T[];
    totalItem: number;
    pageSize: number;
    totalPages: number;
    pageNumber: number;
  };
}

export interface ProductFilters {
  search: string;
  groupName: string;
  status: string;
}

export interface ProductDetail {
  id: string;
  name: string;
  descript: string;
  quantity: number;
  minQuantity: number;
  price: number;
  productImg: string;
  productTypeId: string;
  productTypeName: string;
  productGroupId: string;
  groupName: string;
  storeId: string;
  unitId: string;
  unitName: string;
  createdDate: string;
  updatedDate: string | null;
  status: string;
}

export interface ProductDetailResponse {
  status: number;
  message: string | null;
  data: ProductDetail;
}

export interface UpdateProductDTO {
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

