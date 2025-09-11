import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const ownerId = searchParams.get('ownerId');

    if (!ownerId) {
      return NextResponse.json(
        { error: 'Owner ID is required' },
        { status: 400 }
      );
    }

    const supabase = createClient();

    // First, get the maintenance requests for the owner
    const { data: requests, error: requestsError } = await supabase
      .from('maintenance_requests')
      .select(`
        id,
        vehicle_id,
        owner_id,
        issue,
        priority,
        status,
        created_at,
        updated_at,
        vehicle:vehicles(
          id,
          make,
          model,
          year,
          license_plate
        )
      `)
      .eq('owner_id', ownerId)
      .order('created_at', { ascending: false });

    if (requestsError) {
      console.error('Error fetching maintenance requests:', requestsError);
      return NextResponse.json(
        { error: 'Failed to fetch maintenance requests' },
        { status: 500 }
      );
    }

    return NextResponse.json(requests || []);
  } catch (error) {
    console.error('Error in GET /api/maintenance:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { vehicle_id, owner_id, issue, priority } = await request.json();

    if (!vehicle_id || !owner_id || !issue || !priority) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const supabase = createClient();

    // Create a new maintenance request
    const { data, error } = await supabase
      .from('maintenance_requests')
      .insert([
        {
          vehicle_id: vehicle_id,  // Keep as string to match Supabase table
          owner_id: owner_id,      // Keep as string if it's also a string in the table
          issue,
          priority,
          status: 'pending',
        },
      ])
      .select('*')
      .single();

    if (error) {
      console.error('Error creating maintenance request:', error);
      return NextResponse.json(
        { error: 'Failed to create maintenance request' },
        { status: 500 }
      );
    }

    // Fetch the created request with vehicle details
    const { data: requestWithVehicle, error: fetchError } = await supabase
      .from('maintenance_requests')
      .select(`
        *,
        vehicle:vehicles(*)
      `)
      .eq('id', data.id)
      .single();

    if (fetchError) {
      console.error('Error fetching created request:', fetchError);
      return NextResponse.json(
        { error: 'Created request but failed to fetch details' },
        { status: 500 }
      );
    }

    return NextResponse.json(requestWithVehicle, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/maintenance:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const { status } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Request ID is required' },
        { status: 400 }
      );
    }

    // Validate status value
    const validStatuses = ['pending', 'approved', 'rejected', 'completed'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status value' },
        { status: 400 }
      );
    }

    const supabase = createClient();

    // Update the maintenance request status

    const { error } = await supabase
      .from('maintenance_requests')
      .update({ 
        status, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      console.error('Error updating maintenance request:', error);
      return NextResponse.json(
        { error: 'Failed to update maintenance request' },
        { status: 500 }
      );
    }

    // Fetch the updated request with vehicle details
    const { data: updatedRequest, error: fetchError } = await supabase
      .from('maintenance_requests')
      .select(`
        *,
        vehicle:vehicles(*)
      `)
      .eq('id', id)
      .single();

    if (fetchError) {
      console.error('Error fetching updated request:', fetchError);
      return NextResponse.json(
        { error: 'Updated request but failed to fetch details' },
        { status: 500 }
      );
    }

    return NextResponse.json(updatedRequest);

    if (fetchError) {
      console.error('Error fetching updated maintenance request:', fetchError);
      throw fetchError;
    }

    return NextResponse.json(updatedRequest);
  } catch (error) {
    console.error('Error in PATCH /api/maintenance:', error);
    return NextResponse.json(
      { error: 'Failed to update maintenance request' },
      { status: 500 }
    );
  }
}
