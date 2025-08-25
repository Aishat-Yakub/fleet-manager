import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ownerId = searchParams.get('ownerId');
  const requestId = searchParams.get('requestId');
  const type = searchParams.get('type');

  if (!ownerId) {
    return NextResponse.json({ error: 'Owner ID is required' }, { status: 400 });
  }

  const supabase = createRouteHandlerClient({ cookies });

  try {
    if (type === 'fuel') {
      // ...existing code...
      const { data, error } = await supabase
        .from('fuel_requests')
        .select('*')
        .eq('owner_id', ownerId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return NextResponse.json(data || []);
    }
    if (type === 'condition') {
      // ...existing code...
      const { data, error } = await supabase
        .from('condition_updates')
        .select('*')
        .eq('owner_id', ownerId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return NextResponse.json(data || []);
    }
    if (type === 'inspection') {
      // Fetch inspection files for owner
      const { data, error } = await supabase
        .from('inspection_files')
        .select('*')
        .eq('owner_id', ownerId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return NextResponse.json(data || []);
    }

    if (requestId) {
      // ...existing code...
      const { data, error } = await supabase
        .from('maintenance_requests')
        .select('*')
        .eq('id', requestId)
        .eq('owner_id', ownerId)
        .single();

      if (error) throw error;
      return NextResponse.json(data);
    }

    // ...existing code...
    const { data, error } = await supabase
      .from('maintenance_requests')
      .select('*')
      .eq('owner_id', ownerId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Error fetching maintenance requests:', error);
    return NextResponse.json(
      { error: 'Failed to fetch maintenance requests', details: error },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // Parse body
    const body = await request.json();
    console.log('Raw POST body:', body);

    // Detect if this is a fuel request
    if (body.litres !== undefined && body.reason !== undefined) {
      // ...existing code...
      const { vehicle_id, owner_id, litres, reason } = body;
      if (!vehicle_id || !owner_id || !litres || !reason) {
        return NextResponse.json({ error: 'Missing required fields for fuel request', received: body }, { status: 400 });
      }
      const supabase = createRouteHandlerClient({ cookies });
      try {
        const { data, error } = await supabase
          .from('fuel_requests')
          .insert([
            {
              vehicle_id,
              owner_id,
              litres,
              reason: reason.trim(),
              status: 'pending',
              created_at: new Date().toISOString(),
            },
          ])
          .select()
          .single();
        if (error) throw error;
        return NextResponse.json(data, { status: 201 });
      } catch (error) {
        console.error('Error creating fuel request:', error);
        return NextResponse.json({ error: 'Failed to create fuel request' }, { status: 500 });
      }
    }

    // Detect if this is a condition update
    if (body.condition !== undefined && body.notes !== undefined) {
      // ...existing code...
      const { vehicle_id, owner_id, condition, notes } = body;
      if (!vehicle_id || !owner_id || !condition) {
        return NextResponse.json({ error: 'Missing required fields for condition update', received: body }, { status: 400 });
      }
      const supabase = createRouteHandlerClient({ cookies });
      try {
        const { data, error } = await supabase
          .from('condition_updates')
          .insert([
            {
              vehicle_id,
              owner_id,
              condition: condition.trim(),
              notes: notes ? notes.trim() : '',
              created_at: new Date().toISOString(),
            },
          ])
          .select()
          .single();
        if (error) throw error;
        return NextResponse.json(data, { status: 201 });
      } catch (error) {
        console.error('Error creating condition update:', error);
        return NextResponse.json({ error: 'Failed to create condition update' }, { status: 500 });
      }
    }

    // Detect if this is an inspection file upload
    if (body.file_url !== undefined && body.vehicle_id !== undefined && body.owner_id !== undefined) {
      const { vehicle_id, owner_id, file_url } = body;
      if (!vehicle_id || !owner_id || !file_url) {
        return NextResponse.json({ error: 'Missing required fields for inspection file', received: body }, { status: 400 });
      }
      const supabase = createRouteHandlerClient({ cookies });
      try {
        const { data, error } = await supabase
          .from('inspection_files')
          .insert([
            {
              vehicle_id,
              owner_id,
              file_url,
              created_at: new Date().toISOString(),
            },
          ])
          .select()
          .single();
        if (error) throw error;
        return NextResponse.json(data, { status: 201 });
      } catch (error) {
        console.error('Error creating inspection file:', error);
        return NextResponse.json({ error: 'Failed to create inspection file' }, { status: 500 });
      }
    }

    const { vehicle_id, owner_id, issue, priority } = body;

    // Validate required fields
    if (!vehicle_id || !owner_id || !issue || !priority) {
      return NextResponse.json({ error: 'Missing required fields', received: body }, { status: 400 });
    }

    // Clean string fields
    const cleanIssue = issue.trim();
    const cleanPriority = priority.trim();

    const supabase = createRouteHandlerClient({ cookies });

    // Remove vehicle_id validation since foreign key is dropped
    try {
      const { data, error } = await supabase
        .from('maintenance_requests')
        .insert([
          {
            vehicle_id,
            owner_id,
            issue: cleanIssue,
            priority: cleanPriority,
            status: 'pending',
            created_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error) throw error;

      return NextResponse.json(data, { status: 201 });
    } catch (error) {
      console.error('Error creating maintenance request:', error);
      return NextResponse.json(
        { error: 'Failed to create maintenance request' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Unexpected POST error:', error);
    return NextResponse.json({ error: 'Failed to create maintenance request', details: error }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const { searchParams } = new URL(request.url);
  const requestId = searchParams.get('id');
  const body = await request.json();
  const { status } = body;

  if (!requestId || !status) {
    return NextResponse.json({ error: 'Request ID and status are required', received: body }, { status: 400 });
  }

  const supabase = createRouteHandlerClient({ cookies });

  try {
    const { data, error } = await supabase
      .from('maintenance_requests')
      .update({ status })
      .eq('id', requestId)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating maintenance request status:', error);
    return NextResponse.json({ error: 'Failed to update maintenance request status', details: error }, { status: 500 });
  }
}
