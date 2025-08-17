export type Vehicle = {
  id: number;
  name: string;
  plateNumber: string;
};

export type FuelRequest = {
  id: number;
  date: string;
  status: string;
  amount: string;
  vehicle: string;
  vehicleId?: string;
  notes?: string;
};

export type MaintenanceRequest = {
  id: number;
  vehicleId: number;
  issue: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'completed' | 'rejected';
  createdAt: string;
  updatedAt: string;
  vehicle?: Vehicle;
};
