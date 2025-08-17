import { supabase } from '@/lib/supabase';
import type { Vehicle, CreateVehiclePayload, UpdateVehiclePayload } from '@/types/vehicle';

export type { Vehicle, CreateVehiclePayload };

export const vehicleService = {
  async getVehicles(): Promise<Vehicle[]> {
    const { data, error } = await supabase.from('vehicles').select('*');
    if (error) throw new Error(error.message);
    return data || [];
  },

  async createVehicle(payload: CreateVehiclePayload): Promise<Vehicle> {
    const { data, error } = await supabase.from('vehicles').insert(payload).select();
    if (error) throw new Error(error.message);
    if (!data || data.length === 0) throw new Error('Vehicle creation failed.');
    return data[0];
  },

  async updateVehicle(id: string, payload: UpdateVehiclePayload): Promise<Vehicle> {
    const { data, error } = await supabase.from('vehicles').update(payload).eq('id', id).select();
    if (error) throw new Error(error.message);
    if (!data || data.length === 0) throw new Error('Vehicle update failed.');
    return data[0];
  },

  async deleteVehicle(id: string): Promise<void> {
    const { error } = await supabase.from('vehicles').delete().eq('id', id);
    if (error) throw new Error(error.message);
  },
};
