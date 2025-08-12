import { fetchApi } from '@/lib/api';

export interface Vehicle {
  id: string;
  plateNumber: string;
  registrationDate: string;
  model: string;
  color: string;
  condition: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateVehiclePayload {
  plateNumber: string;
  registrationDate: string;
  model: string;
  color: string;
  condition: string;
  ownerId: string;
}

export const vehicleService = {
  // Create a new vehicle
  async createVehicle(vehicleData: CreateVehiclePayload): Promise<Vehicle> {
    return fetchApi<Vehicle>('/vehicles', {
      method: 'POST',
      body: JSON.stringify(vehicleData),
    });
  },

  // Get all vehicles
  async getVehicles(): Promise<Vehicle[]> {
    const data = await fetchApi<{ vehicles: Vehicle[] }>('/vehicles');
    return data.vehicles || [];
  },

  // Get a single vehicle by ID
  async getVehicleById(id: string): Promise<Vehicle> {
    return fetchApi<Vehicle>(`/vehicles/${id}`);
  },

  // Update a vehicle
  async updateVehicle(id: string, vehicleData: Partial<CreateVehiclePayload>): Promise<Vehicle> {
    return fetchApi<Vehicle>(`/vehicles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(vehicleData),
    });
  },

  // Delete a vehicle
  async deleteVehicle(id: string): Promise<void> {
    return fetchApi(`/vehicles/${id}`, {
      method: 'DELETE',
    });
  },
};
