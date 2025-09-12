export type Vehicle = {
  id: string;
  make: string;
  model: string;
  year: number;
  status: string;
  registration_date?: string;
  color?: string;
  condition?: string;
  owner_id?: string;
  created_at?: string;
  Make?: string;
};

export type FuelRequest = {
  id: string;
  Name: string;
  vehicle_id: string;
  litres: number;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  reason?: string;
  bank: string;
  account: number | string;
};

export type MaintenanceRequest = {
  id: string;
  vehicle_id: string;
  owner_id: string;
  issue: string;
  status: 'pending' | 'approved' | 'rejected' | 'in_progress' | 'completed';
  created_at: string;
  estimated_cost?: number;
  notes?: string;
  assigned_to?: string;
  completed_at?: string;
  name?: string;
};
