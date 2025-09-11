export type Vehicle = {
  id: number;
  name: string;
  plateNumber: string;
};

export type FuelRequest = {
  id: string;
  vehicle_id: string;
  vehicle?: string; 
  owner_id: string;
  litres: number | string;
  amount?: number | string;
  reason: string;
  notes?: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  bank: string;
  account: string | number;
  Name: string;
  created_at: string;
  date?: string; 
};

export interface MaintenanceRequest {
  id: string;
  vehicle_id: string;
  owner_id: string;
  issue: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  name: string | null;
  created_at: string;
  updated_at?: string;
  vehicle?: {
    id: string;
    make?: string;
    model?: string;
    year?: number;
    license_plate?: string;
  };
}

export type ConditionUpdate = {
  id: number;
  vehicle_id: number;
  owner_id: number;
  condition: string;
  notes?: string;
  created_at: string;
};
