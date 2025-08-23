import { supabase } from '../lib/supabaseClient';
import { MaintenanceRequest } from '@/app/manager_page/types';

export async function getMaintenanceRequests(): Promise<MaintenanceRequest[]> {
	const { data, error } = await supabase
		.from('maintenance_requests')
		.select(`
			id,
			vehicle_id,
			owner_id,
			issue,
			priority,
			status,
			created_at
		`);
	if (error) throw new Error(error.message);
	// Map DB fields to UI fields if needed
	return (data || []).map((req: any) => ({
		id: req.id,
		vehicleId: req.vehicle_id,
		requestedBy: req.owner_id?.toString() ?? '',
		issue: req.issue,
		status: req.status,
		requestedAt: req.created_at,
		vehicleMake: req.vehicle_make ?? '',
		vehicleModel: req.vehicle_model ?? '',
		// Add more fields if needed
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
		vehicleId: data.vehicle_id,
		requestedBy: data.owner_id?.toString() ?? '',
		issue: data.issue,
		status: data.status,
		requestedAt: data.created_at,
		estimatedCost: data.estimated_cost,
		vehicleMake: data.vehicle_make ?? '',
		vehicleModel: data.vehicle_model ?? '',
	};
}
