import { supabase } from '../lib/supabaseClient';

export async function createMaintenanceRequest({ 
  vehicle_id, 
  issue, 
  priority 
}: {
  vehicle_id: string;
  issue: string;
  priority: 'low' | 'medium' | 'high';
}) {
  try {
    const { data, error } = await supabase
      .from('maintenance_requests')
      .insert([{ 
        vehicle_id, 
        issue, 
        priority,
        status: 'pending' as const
      }])
      .select('*')
      .single();

    if (error) {
      console.error('Supabase error details:', error);
      throw new Error(error.message || 'Failed to create maintenance request');
    }
    
    if (!data) {
      throw new Error('No data returned from the database');
    }
    
    return data;
  } catch (error) {
    console.error('Error in createMaintenanceRequest:', error);
    throw error;
  }
}

export async function getMaintenanceRequests(ownerId?: string) {
  try {
    if (!ownerId) {
      throw new Error('Owner ID is required to fetch maintenance requests');
    }

    const response = await fetch(`/api/owners?type=maintenance&ownerId=${ownerId}`);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to fetch maintenance requests');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error in getMaintenanceRequests:', error);
    throw error instanceof Error ? error : new Error('Failed to fetch maintenance requests');
  }
}

export async function updateMaintenanceRequest(
  id: string, 
  status: 'pending' | 'approved' | 'rejected' | 'completed'
) {
  const { data, error } = await supabase
    .from('maintenance_requests')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}
