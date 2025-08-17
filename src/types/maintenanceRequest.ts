export interface MaintenanceRequest {
  id: string;
  owner_id: string;
  vehicle_id: string;
  issue: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed' | 'rejected';
  created_at: string;
}

export type CreateMaintenanceRequestPayload = Omit<MaintenanceRequest, 'id' | 'created_at' | 'status'>;
