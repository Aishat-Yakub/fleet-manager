export type Vehicle = {
  id: string;
  make: string;
  model: string;
  year: number;
  status: string;
};

export type FuelRequest = {
  id: string;
  vehicleId: string;
  vehicleMake: string;
  vehicleModel: string;
  requestedBy: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: string;
};

export type MaintenanceRequest = {
  id: string;
  vehicleId: string;
  vehicleMake: string;
  vehicleModel: string;
  requestedBy: string;
  issue: string;
  status: 'pending' | 'approved' | 'rejected' | 'in_progress' | 'completed';
  requestedAt: string;
  estimatedCost?: number;
};
