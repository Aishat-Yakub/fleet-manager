import { NextResponse } from 'next/server';
import { getConditionUpdates, addConditionUpdate } from '@/services/ownerService';
import { getMaintenanceRequests } from '@/services/maintenanceService';
import { supabase } from '@/lib/supabaseClient';

export async function GET(request: Request) {
  console.log('GET /api/owners called');
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    console.log('Request type:', type);
    
    // Handle maintenance requests
    if (type === 'maintenance') {
      console.log('Fetching all maintenance requests');
      
      try {
        const { data: maintenanceRequests, error } = await supabase
          .from('maintenance_requests')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching maintenance requests:', error);
          throw error;
        }

        return NextResponse.json(maintenanceRequests || []);
      } catch (error) {
        console.error('Error in maintenance requests API:', error);
        return NextResponse.json(
          { error: 'Failed to fetch maintenance requests' },
          { status: 500 }
        );
      }
    }
    
    // Handle vehicle conditions request
    if (type === 'condition') {
      console.log('Fetching vehicle conditions');
      const vehicleId = searchParams.get('vehicleId');
      
      // If vehicleId is provided, get specific vehicle condition
      if (vehicleId) {
        const { data: vehicle, error } = await supabase
          .from('vehicles')
          .select('id, condition, created_at')
          .eq('id', vehicleId)
          .single();
          
        if (error) throw error;
        
        // Create response object with explicit type
        const response = {
          vehicle_id: vehicle.id,
          condition: vehicle.condition,
          created_at: vehicle.created_at,
          notes: null as string | null
        };
        
        return NextResponse.json([response]);
      }
      
      // Get all vehicle conditions
    console.log('Fetching all vehicle conditions');
    const { data: vehicles, error } = await supabase
      .from('vehicles')
      .select('id, condition, created_at')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Supabase error:', error);
      throw new Error(`Database error: ${error.message}`);
    }
      
      // Format the response to match the expected format
      const formattedData = vehicles.map(vehicle => ({
        vehicle_id: vehicle.id,
        condition: vehicle.condition,
        created_at: vehicle.created_at,
        notes: null
      }));
      
      return NextResponse.json(formattedData);
    }
    
    // Handle maintenance requests
    if (type === 'maintenance') {
      const ownerId = searchParams.get('ownerId') || undefined;
      const requests = await getMaintenanceRequests(ownerId);
      return NextResponse.json(requests);
    }
    
    // Handle other owner-related GET requests here
    return NextResponse.json({ message: 'Owner endpoint' });
    
  } catch (error) {
    console.error('API Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error('Error details:', {
      message: errorMessage,
      stack: error instanceof Error ? error.stack : 'No stack trace',
      timestamp: new Date().toISOString()
    });
    return NextResponse.json(
      { 
        error: errorMessage,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    console.log('Received request with data:', data);
    
    // Handle vehicle condition updates
    if (data.type === 'condition') {
      try {
        const { vehicle_id, condition, notes } = data;
        console.log('Updating vehicle condition:', { vehicle_id, condition });
        
        if (!vehicle_id || !condition) {
          console.error('Missing required fields:', { vehicle_id, condition });
          return NextResponse.json(
            { error: 'Vehicle ID and condition are required' },
            { status: 400 }
          );
        }
        
        // Update the vehicle's condition directly in the vehicles table
        const { data: updatedVehicle, error } = await supabase
          .from('vehicles')
          .update({
            condition,
            created_at: new Date().toISOString()
          })
          .eq('id', vehicle_id)
          .select('id, condition, created_at')
          .single();
          
        if (error) throw error;
        
        // Create response object with explicit type
        const result = {
          vehicle_id: updatedVehicle.id,
          condition: updatedVehicle.condition,
          created_at: updatedVehicle.created_at,
          notes: notes || null
        };
        
        console.log('Successfully updated vehicle condition:', result);
        return NextResponse.json(result, { status: 200 });
        
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        const errorStack = error instanceof Error ? error.stack : undefined;
        const errorCode = error && typeof error === 'object' && 'code' in error 
          ? (error as { code: string }).code 
          : 'NO_ERROR_CODE';
          
        console.error('Error in condition update handler:', {
          error: errorMessage,
          stack: errorStack,
          requestData: data,
          code: errorCode
        });
        
        return NextResponse.json(
          { 
            error: 'Failed to process condition update',
            details: errorMessage,
            code: errorCode
          },
          { status: 500 }
        );
      }
    }
    
    // Handle other owner-related POST requests here
    return NextResponse.json(
      { error: 'Operation not supported' }, 
      { status: 400 }
    );
    
  } catch (error) {
    console.error('Error in owners API route:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process request',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}