export interface Area {
  id: string;
  name: string;
  descript: string;
  areaImg: string | null;
  storeId: string;
}

export interface JWTPayload {
  storeId: string;
  [key: string]: any;
}