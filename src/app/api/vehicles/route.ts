import { NextResponse } from 'next/server';
import { getVehicles, getVehicleById, createVehicle, updateVehicle, deleteVehicle } from '@/services/vehicleService';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (id) {
      const vehicle = await getVehicleById(id);
      return NextResponse.json(vehicle);
    }
    
    const vehicles = await getVehicles();
    return NextResponse.json(vehicles);
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch vehicles' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const requestData = await request.json();
    
    // Validate required fields
    const requiredFields = ['plate_number', 'model', 'color', 'condition', 'registration_date', 'Name'];
    const missingFields = requiredFields.filter(field => !requestData[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Format condition to match the expected type
    const formatCondition = (condition: string): 'Good' | 'Fair' | 'Poor' => {
      const validConditions = ['Good', 'Fair', 'Poor'] as const;
      const normalizedCondition = condition.charAt(0).toUpperCase() + condition.slice(1).toLowerCase();
      return validConditions.includes(normalizedCondition as unknown as 'Good' | 'Fair' | 'Poor') ? 
        normalizedCondition as 'Good' | 'Fair' | 'Poor' : 
        'Good'; // Default to 'Good' if invalid
    };

    // Prepare vehicle data matching Supabase schema
    const vehicleData = {
      plate_number: requestData.plate_number.toUpperCase().trim(),
      model: requestData.model.trim(),
      color: requestData.color.trim(),
      condition: formatCondition(requestData.condition),
      registration_date: requestData.registration_date,
      status: requestData.status || 'active', // Default to 'active' if not provided
      Name: requestData.Name.trim()
    };

    // Create the vehicle
    const vehicle = await createVehicle(vehicleData);
    
    if (!vehicle) {
      throw new Error('Failed to create vehicle');
    }

    return NextResponse.json(vehicle, { status: 201 });
  } catch (error: unknown) {
    let errorDetails: Record<string, unknown> = {};
    let errorMessage = 'Failed to create vehicle';
    let isDuplicate = false;
    if (error && typeof error === 'object') {
      errorDetails = {
        message: (error as { message?: string }).message,
        name: (error as { name?: string }).name,
        stack: (error as { stack?: string }).stack,
        code: (error as { code?: string }).code,
        details: (error as { details?: string }).details,
        hint: (error as { hint?: string }).hint
      };
      errorMessage = (error as { message?: string }).message || errorMessage;
      isDuplicate = Boolean((error as { details?: string }).details?.includes('already exists') ||
        (error as { message?: string }).message?.includes('duplicate key'));
    }
    console.error('Error in POST /api/vehicles:', errorDetails);
    return NextResponse.json(
      { 
        error: isDuplicate 
          ? 'A vehicle with this plate number already exists'
          : errorMessage,
        details: process.env.NODE_ENV === 'development' ? errorDetails : undefined
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { id, ...updates } = await request.json();
    if (!id) {
      return NextResponse.json(
        { error: 'Vehicle ID is required' },
        { status: 400 }
      );
    }
    
    // Format condition if it's being updated
    if (updates.condition) {
      updates.condition = updates.condition.toLowerCase();
    }
    
    const vehicle = await updateVehicle(id, updates);
    return NextResponse.json(vehicle);
  } catch (error: unknown) {
    let errorMessage = 'Failed to update vehicle';
    if (error && typeof error === 'object' && 'message' in error) {
      errorMessage = (error as { message?: string }).message || errorMessage;
    }
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json(
        { error: 'Vehicle ID is required' },
        { status: 400 }
      );
    }
    await deleteVehicle(id);
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    let errorMessage = 'Failed to delete vehicle';
    if (error && typeof error === 'object' && 'message' in error) {
      errorMessage = (error as { message?: string }).message || errorMessage;
    }
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic'; // Ensure dynamic route handling
