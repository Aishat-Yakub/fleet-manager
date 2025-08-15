import { fetchApi } from '@/lib/api';

export const managerService = {
  // Fuel Requests
  async updateFuelRequest(requestId: string, status: 'approved' | 'rejected', reason?: string) {
    return fetchApi(`/manager/fuel-requests/${requestId}`, {
      method: 'PATCH',
      body: JSON.stringify({ status, reason }),
    });
  },

  // Maintenance Requests
  async updateMaintenanceRequest(requestId: string, status: 'approved' | 'rejected', reason?: string) {
    return fetchApi(`/manager/maintenance-requests/${requestId}`, {
      method: 'PATCH',
      body: JSON.stringify({ status, reason }),
    });
  },

  // Vehicles
  async getVehicles() {
    return fetchApi('/manager/vehicles');
  },

  async updateVehicleStatus(vehicleId: string, status: string) {
    return fetchApi(`/manager/vehicles/${vehicleId}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },

  // Add more manager-specific API calls as needed
};
