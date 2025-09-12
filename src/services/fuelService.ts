import { supabase } from '../lib/supabaseClient';

export interface FuelRequest {
  id: number;
  vehicle_id: number;
  vehicle_name?: string;
  amount_liters: number;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  notes?: string;
}

interface RawFuelRequestData {
  id: number;
  vehicle_id: number;
  amount_liters: number;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  notes?: string;
  vehicles?: {
    name: string;
  };
}

export async function getFuelRequests(): Promise<FuelRequest[]> {
  const { data, error } = await supabase
    .from('fuel_requests')
    .select('*, vehicles(name as vehicle_name)')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching fuel requests:', error);
    throw error;
  }

  // Map the joined data to a flatter structure
  if (!data || !Array.isArray(data)) {
    return [];
  }
  
  return data.map((item: unknown) => {
    const rawItem = item as RawFuelRequestData;
    return {
      id: rawItem.id,
      vehicle_id: rawItem.vehicle_id,
      amount_liters: rawItem.amount_liters,
      status: rawItem.status,
      created_at: rawItem.created_at,
      notes: rawItem.notes,
      vehicle_name: rawItem.vehicles?.name || `Vehicle ${rawItem.vehicle_id}`
    };
  });
}

export async function updateFuelRequestStatus(id: number, status: 'approved' | 'rejected', notes?: string) {
  const { data, error } = await supabase
    .from('fuel_requests')
    .update({ status, notes })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating fuel request status:', error);
    throw error;
  }

  return data;
}
