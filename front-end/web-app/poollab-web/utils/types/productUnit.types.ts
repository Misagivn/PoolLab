export interface Unit {
  id: string;
  name: string;
  descript: string;
}

export interface UnitResponse {
  status: number;
  message: string | null;
  data: Unit[];
}