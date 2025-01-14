export interface TableMaintenanceDTO{
    id: string;
    billiardTableID: string;
    storeId: string;
    tableIssuesId: string | null;
    technicianId: string;
    tableIssuesCode: string;
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