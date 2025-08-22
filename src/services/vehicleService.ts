import VehiclesPage from "@/app/admin/vehicles/page";
import { supabase } from "../lib/supabaseClient";

export interface Vehicle {
  id: number;
  plate_number: string;
  registration_date: string;
  model: string;
  color: string;
  condition: 'Good' | 'Fair' | 'Poor';  // Only these three values are allowed
  owner_id: number;
  status: 'active' | 'inactive' | 'created';  // Only these three statuses are allowed
  created_at: string;
}
// Fetch all vehicles
export async function getVehicles(): Promise<Vehicle[]> {
  const { data, error } = await supabase
    .from('vehicles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching vehicles:', error);
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error('No data returned from vehicles table');
  }

  return data as Vehicle[];
}

// Get a single vehicle by ID
export async function getVehicleById(id: number) {
  try {
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Vehicle;
  } catch (error) {
    console.error(`Error fetching vehicle with ID ${id}:`, error);
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch vehicle');
  }
}

// Create a new vehicle
export async function createVehicle(vehicleData: Omit<Vehicle, 'id' | 'created_at'>) {
  try {
    const { data, error } = await supabase
      .from('vehicles')
      .insert([vehicleData])
      .select()
      .single();

    if (error) throw error;
    return data as Vehicle;
  } catch (error) {
    console.error('Error creating vehicle:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to create vehicle');
  }
}

// Update a vehicle
export async function updateVehicle(id: number, updates: Partial<Vehicle>) {
  try {
    const { data, error } = await supabase
      .from('vehicles')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Vehicle;
  } catch (error) {
    console.error(`Error updating vehicle with ID ${id}:`, error);
    throw new Error(error instanceof Error ? error.message : 'Failed to update vehicle');
  }
}

// Delete a vehicle
export async function deleteVehicle(id: number) {
  try {
    const { error } = await supabase
      .from('vehicles')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error(`Error deleting vehicle with ID ${id}:`, error);
    throw new Error(error instanceof Error ? error.message : 'Failed to delete vehicle');
  }
}
