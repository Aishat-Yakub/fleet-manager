import { supabase } from '@/lib/supabase';
import { MaintenanceRequest, CreateMaintenanceRequestPayload } from '@/types/maintenanceRequest';

export const maintenanceRequestService = {
  async getMaintenanceRequests(): Promise<MaintenanceRequest[]> {
    const { data, error } = await supabase.from('maintenance_requests').select('*');
    if (error) throw new Error(error.message);
    return data || [];
  },

  async getMaintenanceRequestsByOwner(ownerId: string): Promise<MaintenanceRequest[]> {
    const { data, error } = await supabase.from('maintenance_requests').select('*').eq('owner_id', ownerId);
    if (error) throw new Error(error.message);
    return data || [];
  },

  async createMaintenanceRequest(payload: CreateMaintenanceRequestPayload): Promise<MaintenanceRequest> {
    const { data, error } = await supabase.from('maintenance_requests').insert(payload).select();
    if (error) throw new Error(error.message);
    if (!data || data.length === 0) throw new Error('Maintenance request creation failed.');
    return data[0];
  },

  async updateMaintenanceRequestStatus(id: string, status: 'in_progress' | 'completed' | 'rejected'): Promise<MaintenanceRequest> {
    const { data, error } = await supabase
      .from('maintenance_requests')
      .update({ status })
      .eq('id', id)
      .select();
      
    if (error) throw new Error(error.message);
    if (!data || data.length === 0) throw new Error('Maintenance request update failed.');
    return data[0];
  },
};
