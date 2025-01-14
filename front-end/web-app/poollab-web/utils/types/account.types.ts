export interface AccountDTO{
    id: string;
    email: string;
    passwordHash: string;
    avatarUrl: string;
    userName: string;
    fullName: string;
    phoneNumber: string;
    roleId: string;
    storeId: string;
    point: string;
    balance: number;
    totalTime: string | null; 
    rank: string | null;
    tier: number | null;
    subId: string | null;
    joinDate: string;
    status: string;
}