export type Vehicle = {
  id: number;
  name: string;
  plateNumber: string;
};

export type FuelRequest = {
  id: number;
  vehicle_id: string | number;
  vehicle?: string;  // For display name
  owner_id: string | number;
  litres: number | string;
  amount?: number | string;  // Alias for litres for compatibility
  reason: string;
  notes?: string;  // Alias for reason for compatibility
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  account_details: string;
  created_at: string;
  date?: string;  // Alias for created_at for display
};

export interface MaintenanceRequest {
  id: number;
  vehicle_id: number;  // Changed from vehicleId
  owner_id: number;    // Changed from ownerId (and type from string to number)
  issue: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  created_at?: string;  // Made optional since it's generated on the server
  updated_at?: string;
  vehicle?: {
    id: number;
    make: string;
    model: string;
    year: number;
    license_plate: string;  // Changed from licensePlate
  };
}
[{"idx":0,"id":"1","vehicle_id":2233,"owner_id":1,"condition":"Fair","notes":"working","created_at":"2025-08-25 02:13:13.354+00"},{"idx":1,"id":"3","vehicle_id":5,"owner_id":3,"condition":"Fair","notes":"vehicle maintenance","created_at":"2025-08-28 03:33:07+00"}]
export type ConditionUpdate = {
  id: number;
  vehicle_id: number;
  owner_id: number;
  condition: string;
  notes?: string;
  created_at: string;
};
