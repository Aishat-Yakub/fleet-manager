export async function updateVehicleStatus(id: string, status: 'active' | 'inactive' | 'created'): Promise<Vehicle> {
	const { data, error } = await supabase
		.from('vehicles')
		.update({ status })
		.eq('id', id)
		.select()
		.single();
	if (error) throw new Error(error.message);
	return {
		id: data.id,
		make: data.Make ?? '',
		model: data.model,
		year: new Date(data.registration_date).getFullYear() || new Date().getFullYear(),
		status: data.status,
		registration_date: data.registration_date,
		color: data.color,
		condition: data.condition,
		owner_id: data.owner_id,
		created_at: data.created_at,
		Make: data.Make ?? '',
	};
}
import { supabase } from '../lib/supabaseClient';
import { MaintenanceRequest, FuelRequest, Vehicle } from '@/app/manager_page/types';
export async function getVehicles(): Promise<Vehicle[]> {
  const { data, error } = await supabase
    .from('vehicles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  
  return (data || []).map((v) => ({
    id: v.id,
    make: v.model.split(' ')[0], // Extract make from model string
    model: v.model,
    year: v.registration_date ? new Date(v.registration_date).getFullYear() : new Date().getFullYear(),
    status: v.status,
    registration_date: v.registration_date,
    color: v.color,
    condition: v.condition,
    created_at: v.created_at
  }));
}
type FuelRequestRow = {
	id: string;
	vehicle_id: string;
	owner_id?: string | number;
	litres: number;
	reason: string;
	status: string;
	created_at: string;
	bank?: string;
	account?: string;
	vehicle_make?: string;
	vehicle_model?: string;
	Name?: string;
	name?: string;
};

export async function getFuelRequests(): Promise<FuelRequest[]> {
	const { data, error } = await supabase
		.from('fuel_requests')
		.select(`
			id,
			vehicle_id,
			owner_id,
			litres,
			reason,
			status,
			created_at,
			bank,
			account,
			Name
		`);
	if (error) throw new Error(error.message);
	return (data || []).map((req: FuelRequestRow) => ({
		id: req.id,
		vehicle_id: req.vehicle_id,
		requestedBy: req.owner_id?.toString() ?? '',
		Name: req.Name || '',
		amount: req.litres,
		status: req.status as 'pending' | 'approved' | 'rejected',
		requestedAt: req.created_at,
		vehicleMake: req.vehicle_make ?? '',
		vehicleModel: req.vehicle_model ?? '',
		reason: req.reason,
		bank: req.bank ?? '',
		account: req.account ?? ''
	}));
}

export async function updateFuelRequestStatus(
	id: string,
	status: 'approved' | 'rejected'
): Promise<FuelRequest> {
	const { data, error } = await supabase
		.from('fuel_requests')
		.update({ status })
		.eq('id', id)
		.select()
		.single();
	if (error) throw new Error(error.message);
	return {
		id: data.id,
		vehicle_id: data.vehicle_id,
		requestedBy: data.owner_id?.toString() ?? '',
		Name: data.Name || '',
		amount: data.litres,
		status: data.status,
		requestedAt: data.created_at,
		vehicleMake: data.vehicle_make ?? '',
		vehicleModel: data.vehicle_model ?? '',
		reason: data.reason,
		bank: data.bank ?? '',
		account: data.account ?? ''
	};
}

export async function getMaintenanceRequests(): Promise<MaintenanceRequest[]> {
	const { data, error } = await supabase
		.from('maintenance_requests')
		   .select(`
			   id,
			   vehicle_id,
			   issue,
			   priority,
			   status,
			   created_at,
			   name
		   `);
	if (error) throw new Error(error.message);
	// Map DB fields to UI fields if needed
		   type MaintenanceRequestRow = {
			   id: string;
			   vehicle_id: string;
			   issue: string;
			   priority?: string;
			   status: string;
			   created_at: string;
			   vehicle_make?: string;
			   vehicle_model?: string;
			   estimated_cost?: number;
			   name?: string;
		   };

	   return (data || []).map((req: MaintenanceRequestRow) => ({
		   id: req.id,
		   vehicle_id: req.vehicle_id,
		   owner_id: '', // No owner_id in table, set as empty string
		   issue: req.issue,
		   status: req.status as 'pending' | 'approved' | 'rejected' | 'completed' | 'in_progress',
		   created_at: req.created_at,
		   estimated_cost: req.estimated_cost,
		   notes: '',
		   assigned_to: '',
		   completed_at: '',
		   name: req.name || '', // Requester's name
		   requestedAt: req.created_at,
	   }));
}

export async function updateMaintenanceRequest(
	id: number,
	status: string,
	updates: { estimatedCost?: number }
): Promise<MaintenanceRequest> {
	const { data, error } = await supabase
		.from('maintenance_requests')
		.update({
			status,
			...(updates.estimatedCost !== undefined && { estimated_cost: updates.estimatedCost })
		})
		.eq('id', id)
		.select()
		.single();
	if (error) throw new Error(error.message);
	return {
		id: data.id,
		vehicle_id: data.vehicle_id,
		owner_id: data.owner_id?.toString() ?? '',
		issue: data.issue,
		status: data.status,
		created_at: data.created_at,
		estimated_cost: data.estimated_cost,
		notes: data.notes || '',
		assigned_to: data.assigned_to || '',
		completed_at: data.completed_at || '',
		name: data.name || '', // Requester's name
		requestedAt: data.created_at,
	};
}
