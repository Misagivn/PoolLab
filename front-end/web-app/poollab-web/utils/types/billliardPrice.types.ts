export interface BilliardPrice {
  id: string;
  name: string;
  descript: string | null;
  oldPrice: number;
  newPrice: number;
  timeStart: string;
  timeEnd: string;
  status: string;
}

export interface BilliardPriceFormData {
  name: string;
  descript: string;
  oldPrice: number;
  newPrice: number;
  timeStart: string;
  timeEnd: string;
}