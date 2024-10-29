// export interface Store {
//   id: string;
//   name: string;
// }

// export interface Company {
//   id: string;
//   name: string;
// }

// export interface LoginResponse {
//   token: string;
//   role: 'staff' | 'manager' | 'supermanager' | 'admin';
// }

export interface LoginResponse {
  token: string;
  role: string;
}

export interface LoginPayload {
  email: string;
  password: string;
  storeId: string;
  companyId: string | null;
}

//Table
export interface Table {
  id: number;
  name: string;
  status: 'available' | 'occupied' | 'reserved';
  type: 'phang' | 'lo' | 'lip';
  imageUrl: string;
}

export interface MenuItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

export interface TableState {
  orderItems: MenuItem[];
  isActive: boolean;
  startTime: number;
  elapsedTime: number;
}