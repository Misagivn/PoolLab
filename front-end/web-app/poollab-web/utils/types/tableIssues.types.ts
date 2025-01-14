export interface TableIssue {
  id: string;
  billiardTableID: string;
  storeId: string;
  customerID: string | null;
  username: string | null;
  billiardName: string;
  tableIssuesCode: string;
  issueImg: string;
  descript: string;
  estimatedCost: number;
  reportedBy: string;
  paymentMethod: string;
  createdDate: string;
  updatedDate: string | null;
  status: string;
  repairStatus: string;
}

export interface TableIssuesResponse {
  items: TableIssue[];
  totalItem: number;
  pageSize: number;
  totalPages: number;
  pageNumber: number;
}