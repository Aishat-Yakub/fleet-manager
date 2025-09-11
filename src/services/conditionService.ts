import { supabase } from "../lib/supabaseClient";

export interface ConditionUpdate {
  id: number;
  name: string;
  vehicle_id: string;
  conditon: 'Good' | 'Fair' | 'Poor';
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  note?: string;
}

// Fetch all condition updates
export async function getConditionUpdates(): Promise<ConditionUpdate[]> {
  console.log('Fetching condition updates from Supabase...');
  
  const { data, error, count } = await supabase
    .from('condition_updates')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false });

  console.log('Supabase response:', { data, error, count });

  if (error) {
    console.error('Error fetching condition updates:', error);
    throw new Error(error.message);
  }

  console.log(`Found ${data?.length || 0} condition updates`);
  return data as ConditionUpdate[];
}

// Update condition update status
export async function updateConditionStatus(id: number, status: 'approved' | 'rejected', note?: string) {
  const { data, error } = await supabase
    .from('condition_updates')
    .update({ status, note })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating condition status:', error);
    throw new Error(error.message);
  }

  return data as ConditionUpdate;
}

// Submit a new condition update
export async function submitConditionUpdate(conditionUpdate: {
  name: string;
  vehicle_id: string;
  conditon: 'Good' | 'Fair' | 'Poor';
  note?: string;
}) {
  const { data, error } = await supabase
    .from('condition_updates')
    .insert([{
      name: conditionUpdate.name,
      vehicle_id: conditionUpdate.vehicle_id,
      conditon: conditionUpdate.conditon,
      status: 'pending',
      created_at: new Date().toISOString(),
      note: conditionUpdate.note
    }])
    .select()
    .single();

  if (error) {
    console.error('Error submitting condition update:', error);
    throw new Error(error.message);
  }

  return data as ConditionUpdate;
}
