import { Staff, StaffFormData, CreateStaffRequest } from './staff.types';
import { Store } from './store';

export type Manager = Staff;

export interface ManagerFormData extends StaffFormData {
  storeId: string;
}

export interface CreateManagerRequest extends CreateStaffRequest {
  storeId: string;
}