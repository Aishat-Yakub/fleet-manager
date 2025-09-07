import { supabase } from '@/lib/supabaseClient';

// Get vehicle conditions with optional vehicle ID filter
export const getConditionUpdates = async (vehicleId?: string) => {
  try {
    // First get the base query
    let query = supabase
      .from('vehicles')
      .select('id, condition, updated_at')
      .order('updated_at', { ascending: false });

    // Add filter if vehicleId is provided
    if (vehicleId) {
      query = query.eq('id', vehicleId);
    }

    // Execute the query
    const { data, error } = await query;
    if (error) throw error;
    
    // Map the data to the expected format
    return (data || []).map(vehicle => ({
      vehicle_id: vehicle.id,
      condition: vehicle.condition,
      created_at: vehicle.updated_at,
      notes: null 
    }));
  } catch (error) {
    console.error('Error fetching vehicle conditions:', error);
    throw error;
  }
};

// Update a vehicle's condition
export const addConditionUpdate = async (updateData: {
  vehicle_id: string;
  condition: string;
  notes?: string;
}) => {
  console.log('Updating vehicle condition with data:', updateData);
  
  try {
    // Update the vehicle's condition directly
    const { data, error } = await supabase
      .from('vehicles')
      .update({
        condition: updateData.condition,
        updated_at: new Date().toISOString()
      })
      .eq('id', updateData.vehicle_id)
      .select()
      .single();

    if (error) throw error;
    
    console.log('Successfully updated vehicle condition:', data);
    return {
      ...data,
      // Map to match the expected return type
      vehicle_id: data.id,
      created_at: data.updated_at,
      notes: updateData.notes || null
    };
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