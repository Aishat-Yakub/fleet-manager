import { supabase } from '@/lib/supabaseClient';

// Get condition updates with optional vehicle ID filter
export const getConditionUpdates = async (vehicleId?: string) => {
  try {
    let query = supabase
      .from('condition_updates')
      .select('*')
      .order('created_at', { ascending: false });

    if (vehicleId) {
      query = query.eq('vehicle_id', vehicleId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching condition updates:', error);
    throw error;
  }
};

// Add a new condition update
export const addConditionUpdate = async (updateData: {
  vehicle_id: string;
  condition: string;
  notes?: string;
}) => {
  console.log('Attempting to add condition update with data:', updateData);
  
  try {
    // First, check if the vehicle already has a condition update
    const { data: existingUpdates, error: fetchError } = await supabase
      .from('condition_updates')
      .select('*')
      .eq('vehicle_id', updateData.vehicle_id);

    if (fetchError) {
      console.error('Error checking for existing updates:', fetchError);
      throw fetchError;
    }

    let result;
    
    if (existingUpdates && existingUpdates.length > 0) {
      // Get the existing ID as a string
      const existingId = existingUpdates[0]?.id;
      
      // Update existing record
      const { data: updated, error: updateError } = await supabase
        .from('condition_updates')
        .update({
          id: existingId, // Ensure we keep the same ID
          condition: updateData.condition,
          notes: updateData.notes || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingId) // Use the ID for the update
        .select()
        .single();
      
      if (updateError) throw updateError;
      result = updated;
    } else {
      // Generate a new ID (using timestamp + random string for uniqueness)
      const newId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Insert new record with explicit string ID
      const { data: inserted, error: insertError } = await supabase
        .from('condition_updates')
        .insert([{
          id: newId,
          vehicle_id: updateData.vehicle_id,
          condition: updateData.condition,
          notes: updateData.notes || null
        }])
        .select()
        .single();
      
      if (insertError) throw insertError;
      result = inserted;
    }
    
    console.log('Successfully updated condition:', result);
    return result;
  } catch (error) {
    console.error('Error in addConditionUpdate:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      updateData
    });
    throw error;
  }
};

// Submit a maintenance request
export const submitMaintenanceRequest = async (requestData: {
  vehicleId: number | string;
  ownerId: number;
  issue: string;
  priority: 'low' | 'medium' | 'high';
}) => {
  try {
    const { data, error } = await supabase
      .from('maintenance_requests')
      .insert([{
        vehicle_id: requestData.vehicleId,
        owner_id: requestData.ownerId,
        issue: requestData.issue,
        priority: requestData.priority,
        status: 'pending'
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error submitting maintenance request:', error);
    throw error;
  }
};