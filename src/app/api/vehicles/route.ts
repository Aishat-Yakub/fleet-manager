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
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch vehicles' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const requestData = await request.json();
    
    // Validate required fields
    const requiredFields = ['plate_number', 'model', 'color', 'condition', 'registration_date'];
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
      return validConditions.includes(normalizedCondition as any) ? 
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
      status: requestData.status || 'active' // Default to 'active' if not provided
    };

    // Create the vehicle
    const vehicle = await createVehicle(vehicleData);
    
    if (!vehicle) {
      throw new Error('Failed to create vehicle');
    }

    return NextResponse.json(vehicle, { status: 201 });
  } catch (error: any) {
    const errorDetails = {
      message: error.message,
      name: error.name,
      stack: error.stack,
      code: error.code,
      details: error.details,
      hint: error.hint
    };
    
    console.error('Error in POST /api/vehicles:', errorDetails);
    
    const errorMessage = error.message || 'Failed to create vehicle';
    const isDuplicate = error.details?.includes('already exists') || 
                       error.message?.includes('duplicate key');
    
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
    
    const vehicle = await updateVehicle(Number(id), updates);
    return NextResponse.json(vehicle);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update vehicle' },
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
    await deleteVehicle(Number(id));
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete vehicle' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic'; // Ensure dynamic route handling
