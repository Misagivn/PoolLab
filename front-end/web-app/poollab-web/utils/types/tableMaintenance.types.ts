export interface TableMaintenance {
  id: string;
  billiardTableID: string;
  storeId: string;
  tableIssuesId: string | null;
  technicianId: string;
  tableIssuesCode: string | null;
  staffName: string;
  tableName: string;
  tableMainCode: string;
  reason: string;
  estimatedCost: number;
  startDate: string;
  endDate: string;
  createdDate: string;
  updatedDate: string | null;
  status: string;
}

export interface MaintenanceResponse {
  status: number;
  message: string | null;
  data: TableMaintenance;
}

export interface MaintenanceListResponse {
  status: number;
  message: string | null;
  data: {
    items: TableMaintenance[];
    totalItem: number;
    pageSize: number;
    totalPages: number;
    pageNumber: number;
  };
}

export interface CreateMaintenanceRequest {
  tableIssuesId: string;
  technicianId: string;
  cost: number;
  startDate: string;
  endDate: string;
}

export interface UpdateMaintenanceStatusRequest {
  status: string;
}