import { NextResponse } from 'next/server';
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
    
    // Handle users list request
    if (type === 'users') {
      console.log('Fetching all users with roles');
      
      try {
        const { data: users, error } = await supabase
          .from('users')
          .select(`
            id,
            email,
            role_id,
            created_at,
            roles (
              role_name
            )
          `)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching users:', error);
          throw error;
        }

        // Format the response to match the expected frontend format
        const formattedUsers = users.map(user => ({
          id: user.id,
          email: user.email,
          role_id: user.role_id,
          created_at: user.created_at,
          roles: user.roles && user.roles.length > 0 ? { role_name: user.roles[0].role_name } : null,
          status: 'active' // Default status if not in your database
        }));

        return NextResponse.json(formattedUsers);
      } catch (error) {
        console.error('Error in users API:', error);
        return NextResponse.json(
          { error: 'Failed to fetch users' },
          { status: 500 }
        );
      }
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


export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Delete the user from the users table
    const { error: dbError } = await supabase
      .from('users')
      .delete()
      .eq('id', id);

    if (dbError) {
      console.error('Error deleting user from database:', dbError);
      return NextResponse.json(
        { 
          error: 'Failed to delete user',
          details: dbError.message 
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'User deleted successfully' },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Error in DELETE handler:', error);
    return NextResponse.json(
      { 
        error: 'Internal Server Error',
        details: error instanceof Error ? error.message : 'Unknown error',
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
    
    // Handle user creation
    if (data.type === 'users') {
      try {
        const { email, password, role_id, name } = data;
        
        // Validate input
        if (!email || !password || !role_id) {
          console.error('Missing required fields for user creation:', { email, role_id });
          return NextResponse.json(
            { 
              error: 'Validation Error',
              details: 'Email, password, and role_id are required',
              fields: { email: !email, password: !password, role_id: !role_id }
            },
            { status: 400 }
          );
        }
        
        // Check if user already exists
        const { data: existingUser } = await supabase
          .from('users')
          .select('id')
          .eq('email', email)
          .maybeSingle();
          
        if (existingUser) {
          return NextResponse.json(
            { 
              error: 'User already exists',
              details: 'A user with this email already exists',
              code: 'USER_EXISTS'
            },
            { status: 409 }
          );
        }
        
        // Create user in auth.users
        const { data: authData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name: name || '',
              role_id: Number(role_id)
            }
          }
        });
        
        if (signUpError) {
          console.error('Error creating auth user:', signUpError);
          return NextResponse.json(
            { 
              error: 'Authentication Error',
              details: signUpError.message,
              code: signUpError.status || 'AUTH_ERROR'
            },
            { status: 400 }
          );
        }
        
        if (!authData.user) {
          throw new Error('No user data returned from auth');
        }
        
        // Create user in public.users with the correct schema
        const { data: createdUser, error: userError } = await supabase
          .from('users')
          .insert([
            {
              id: authData.user.id,
              email,
              password, // Store hashed password (Supabase Auth handles the hashing)
              role_id: Number(role_id),
              status: 'active',
              created_at: new Date().toISOString(),
              // Add role based on role_id
              role: role_id === '1' ? 'user' : 
                    role_id === '2' ? 'admin' : 
                    role_id === '3' ? 'manager' : 'user'
            }
          ])
          .select('*')
          .single();
          
        if (userError) {
          // If user creation in public.users fails, try to clean up the auth user
          await supabase.auth.admin.deleteUser(authData.user.id).catch(console.error);
          
          console.error('Error creating user in users table:', userError);
          return NextResponse.json(
            { 
              error: 'Database Error',
              details: userError.message,
              code: 'USER_CREATION_FAILED',
              hint: 'Check if the users table has the correct columns (id, email, password, role_id, status, created_at, role)'
            },
            { status: 500 }
          );
        }
        
        console.log('Successfully created user:', createdUser);
        return NextResponse.json(createdUser, { status: 201 });
        
      } catch (error) {
        console.error('Unexpected error in user creation:', error);
        return NextResponse.json(
          { 
            error: 'Internal Server Error',
            details: error instanceof Error ? error.message : 'An unexpected error occurred',
            code: 'INTERNAL_ERROR'
          },
          { status: 500 }
        );
      }
    }
    
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