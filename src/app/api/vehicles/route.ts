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

    // Format condition to match database (Title Case)
    const formatCondition = (condition: string) => {
      return condition.charAt(0).toUpperCase() + condition.slice(1).toLowerCase();
    };

    // Prepare vehicle data matching Supabase schema
    const vehicleData = {
      plate_number: requestData.plate_number.toUpperCase().trim(),
      model: requestData.model.trim(),
      color: requestData.color.trim().toUpperCase(),
      condition: formatCondition(requestData.condition),
      registration_date: requestData.registration_date,
      status: requestData.status || 'active',
      owner_id: 1, // TODO: Get from session
      created_at: new Date().toISOString()
    };

    // Create the vehicle
    const vehicle = await createVehicle(vehicleData);
    
    if (!vehicle) {
      throw new Error('Failed to create vehicle');
    }

    return NextResponse.json(vehicle, { status: 201 });
  } catch (error: any) {
    console.error('Error in POST /api/vehicles:', error);
    return NextResponse.json(
      { 
        error: error.message.includes('duplicate key') 
          ? 'A vehicle with this plate number already exists'
          : 'Failed to create vehicle',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
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
    return NextResponse.json({ success: true });vehicleData
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete vehicle' },
      { status: 500 }
    );
  }
}
