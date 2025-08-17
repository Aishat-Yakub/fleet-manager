import { supabase } from '@/lib/supabase';
import { FuelRequest, CreateFuelRequestPayload } from '@/types/fuelRequest';

export const fuelRequestService = {
  async getFuelRequests(): Promise<FuelRequest[]> {
    const { data, error } = await supabase.from('fuel_requests').select('*');
    if (error) throw new Error(error.message);
    return data || [];
  },

  async getFuelRequestsByOwner(ownerId: string): Promise<FuelRequest[]> {
    const { data, error } = await supabase.from('fuel_requests').select('*').eq('owner_id', ownerId);
    if (error) throw new Error(error.message);
    return data || [];
  },

  async createFuelRequest(payload: CreateFuelRequestPayload): Promise<FuelRequest> {
    const { data, error } = await supabase.from('fuel_requests').insert(payload).select();
    if (error) throw new Error(error.message);
    if (!data || data.length === 0) throw new Error('Fuel request creation failed.');
    return data[0];
  },

  async updateFuelRequestStatus(id: string, status: 'approved' | 'rejected'): Promise<FuelRequest> {
    const { data, error } = await supabase
      .from('fuel_requests')
      .update({ status })
      .eq('id', id)
      .select();
      
    if (error) throw new Error(error.message);
    if (!data || data.length === 0) throw new Error('Fuel request update failed.');
    return data[0];
  },
};
