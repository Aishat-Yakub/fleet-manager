import { supabase } from '../lib/supabaseClient';

export async function createMaintenanceRequest({ vehicle_id, owner_id, issue, priority }: {
  vehicle_id: number;
  owner_id: number;
  issue: string;
  priority: 'low' | 'medium' | 'high';
}) {
  const { data, error } = await supabase
    .from('maintenance_requests')
    .insert([{ vehicle_id, owner_id, issue, priority }])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}
