export type Vehicle = {
  id: number;
  name: string;
  plateNumber: string;
};

export type FuelRequest = {
  id: number;
  vehicle_id: number;
  owner_id: number;
  litres: number;
  reason: string;
  status: string;
  created_at: string;
};

export interface MaintenanceRequest {
  id: number;
  vehicle_id: number;  // Changed from vehicleId
  owner_id: number;    // Changed from ownerId (and type from string to number)
  issue: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  created_at: string;
  updated_at?: string;
  vehicle?: {
    id: number;
    make: string;
    model: string;
    year: number;
    license_plate: string;  // Changed from licensePlate
  };
}

export type ConditionUpdate = {
  id: number;
  vehicle_id: number;
  condition: string;
  notes?: string;
  created_at: string;
};
