export interface TableIssuesDTO{
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