export interface Config {
  id: string;
  name: string;
  timeAllowBook: number;
  timeDelay: number;
  timeHold: number;
  timeCancelBook: number;
  deposit: number;
  monthLimit: number;
  dayLimit: number;
  createdDate: string;
  updateDate: string;
  status: string;
}

export interface ConfigResponse {
  status: number;
  message: string | null;
  data: Config;
}
