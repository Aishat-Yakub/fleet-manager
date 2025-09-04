import { NextResponse } from 'next/server';
import { getConditionUpdates, addConditionUpdate } from '@/services/ownerService';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    
    // Handle condition updates request
    if (type === 'condition') {
      const vehicleId = searchParams.get('vehicleId') || undefined;
      const updates = await getConditionUpdates(vehicleId);
      return NextResponse.json(updates);
    }
    
    // Handle other owner-related GET requests here
    return NextResponse.json({ message: 'Owner endpoint' });
    
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An error occurred' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    console.log('Received request with data:', data);
    
    // Handle condition updates
    if (data.type === 'condition') {
      try {
        const { vehicle_id, condition, notes } = data;
        console.log('Processing condition update for vehicle:', vehicle_id);
        
        if (!vehicle_id || !condition) {
          console.error('Missing required fields:', { vehicle_id, condition });
          return NextResponse.json(
            { error: 'Vehicle ID and condition are required' },
            { status: 400 }
          );
        }
        
        console.log('Calling addConditionUpdate with:', { vehicle_id, condition, notes });
        const newUpdate = await addConditionUpdate({ 
          vehicle_id, 
          condition, 
          notes: notes || null 
        });
        
        console.log('Successfully added condition update:', newUpdate);
        return NextResponse.json(newUpdate, { status: 201 });
        
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