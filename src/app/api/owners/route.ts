import { NextResponse } from 'next/server';
import { createUser, getUsers, updateUserRole, deleteUser } from '@/services/authService';
import { createMaintenanceRequest } from '@/services/maintenanceService';
import { User } from '@/types/type';

export async function GET() {
  try {
    const users = await getUsers();
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const url = new URL(request.url);
    const type = url.searchParams.get('type');
    const body = await request.json();
    
    if (type === 'users' || body.type === 'user') {
      const { email, password, role_id } = body;
      if (!email || !password || role_id === undefined) {
        return NextResponse.json(
          { error: 'Missing required user fields: email, password, and role_id are required' },
          { status: 400 }
        );
      }
      const user = await createUser(email, password, Number(role_id));
      return NextResponse.json(user, { status: 201 });
    } else if (type === 'maintenance' || body.type === 'maintenance') {
      const { vehicle_id, owner_id, issue, priority } = body;
      if (!vehicle_id || !owner_id || !issue || !priority) {
        return NextResponse.json(
          { error: 'Missing required maintenance fields' },
          { status: 400 }
        );
      }
      const maintenance = await createMaintenanceRequest({ vehicle_id, owner_id, issue, priority });
      return NextResponse.json(maintenance, { status: 201 });
    } else {
      return NextResponse.json(
        { error: 'Invalid type specified' },
        { status: 400 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to process request' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { id, role_id } = await request.json();
    if (!role_id) {
      return NextResponse.json(
        { error: 'role_id is required' },
        { status: 400 }
      );
    }
    const user = await updateUserRole(id, role_id);
    return NextResponse.json(user);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update user role' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    await deleteUser(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete user' },
      { status: 500 }
    );
  }
}
