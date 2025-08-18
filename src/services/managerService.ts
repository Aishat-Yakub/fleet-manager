import { supabase } from '../lib/supabase';

type Vehicle = {
  plate_number: string;
  model: string;
};

type Driver = {
  full_name: string;
  avatar_url?: string;
};

export type FuelRequest = {
  id: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  request_date: string;
  rejection_reason?: string;
  vehicles: Vehicle[];
  drivers: Driver[];
};

export const managerService = {
  async getFuelRequests(): Promise<FuelRequest[]> {
    const { data, error } = await supabase
      .from('fuel_requests')
      .select(`
        id,
        amount,
        status,
        request_date,
        rejection_reason,
        vehicles (plate_number, model),
        drivers:driver_id (full_name, avatar_url)
      `)
      .order('request_date', { ascending: false });

    if (error) {
      console.error('Error fetching fuel requests:', error);
      throw new Error('Failed to fetch fuel requests.');
    }

    return data || [];
  },

  async updateFuelRequest(
    requestId: string, 
    status: 'approved' | 'rejected', 
    rejectionReason?: string
  ): Promise<{ success: true }> {
    const { error } = await supabase
      .from('fuel_requests')
      .update({
        status,
        rejection_reason: status === 'rejected' ? rejectionReason : null,
        // You might want to add an 'approved_by' or 'processed_by' field here
      })
      .eq('id', requestId);

    if (error) {
      console.error(`Error updating fuel request ${requestId}:`, error);
      throw new Error('Failed to update fuel request.');
    }

    return { success: true };
  },
};
