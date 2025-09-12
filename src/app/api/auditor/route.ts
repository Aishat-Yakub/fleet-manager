import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const supabase = createClient();

    console.log('GET /api/auditor called with type:', type);

    switch (type) {
      case 'condition-updates':
        console.log('Fetching condition updates');
        const { data: conditionUpdates, error: conditionUpdatesError } = await supabase
          .from('condition_updates')
          .select('*')
          .order('created_at', { ascending: false });

        if (conditionUpdatesError) {
          console.error('Error fetching condition updates:', conditionUpdatesError);
          return NextResponse.json(
            { error: 'Failed to fetch condition updates' },
            { status: 500 }
          );
        }

        return NextResponse.json(conditionUpdates || []);

      case 'fuel_requests':
        console.log('Fetching fuel requests');
        const { data: fuelRequests, error: fuelError } = await supabase
          .from('fuel_requests')
          .select('*')
          .order('created_at', { ascending: false });

        if (fuelError) {
          console.error('Error fetching fuel requests:', fuelError);
          return NextResponse.json(
            { error: 'Failed to fetch fuel requests' },
            { status: 500 }
          );
        }

        return NextResponse.json(fuelRequests || []);

      case 'maintenance-requests':
        console.log('Fetching maintenance requests');
        const { data: maintenanceRequests, error: maintenanceError } = await supabase
          .from('maintenance_requests')
          .select('*')
          .order('created_at', { ascending: false });

        if (maintenanceError) {
          console.error('Error fetching maintenance requests:', maintenanceError);
          return NextResponse.json(
            { error: 'Failed to fetch maintenance requests' },
            { status: 500 }
          );
        }

        return NextResponse.json(maintenanceRequests || []);

      case 'vehicles':
        console.log('Fetching vehicles');
        const { data: allVehicles, error: allVehiclesError } = await supabase
          .from('vehicles')
          .select(`
            id,
            plate_number,
            model,
            color,
            condition,
            status,
            registration_date,
            created_at,
            Name
          `)
          .order('created_at', { ascending: false });

        if (allVehiclesError) {
          console.error('Error fetching vehicles:', allVehiclesError);
          return NextResponse.json(
            { error: 'Failed to fetch vehicles' },
            { status: 500 }
          );
        }

        return NextResponse.json(allVehicles || []);

      default:
        return NextResponse.json(
          { error: 'Invalid type parameter' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Unexpected error in auditor API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
