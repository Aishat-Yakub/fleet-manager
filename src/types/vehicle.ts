export interface Vehicle {
  id: string;
  plate_number: string;
  registration_date: string;
  model: string;
  color: string;
  condition: string;
  owner_id: string;
  status: string;
}

export type CreateVehiclePayload = Omit<Vehicle, 'id'>;
export type UpdateVehiclePayload = Partial<CreateVehiclePayload>;
