export interface FuelRequest {
  id: string;
  owner_id: string;
  vehicle_id: string;
  litres: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export type CreateFuelRequestPayload = Omit<FuelRequest, 'id' | 'created_at' | 'status'>;
