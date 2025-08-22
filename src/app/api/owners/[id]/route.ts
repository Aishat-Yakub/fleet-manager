import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Owner, OwnerFormData } from '@/types/type';

interface Params {
  params: {
    id: string;
  };
}

// GET /api/owners/[id] - Get a single owner by ID
export async function GET(request: Request, { params }: Params) {
  const supabase = createRouteHandlerClient({ cookies });
  
  try {
    const { data: owner, error } = await supabase
      .from('owners')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error) throw error;
    if (!owner) {
      return NextResponse.json(
        { error: 'Owner not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(owner);
  } catch (error) {
    console.error(`Error fetching owner ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch owner' },
      { status: 500 }
    );
  }
}

// PUT /api/owners/[id] - Update an owner
export async function PUT(request: Request, { params }: Params) {
  const supabase = createRouteHandlerClient({ cookies });
  
  try {
    const ownerData: OwnerFormData = await request.json();
    
    const { data: updatedOwner, error } = await supabase
      .from('owners')
      .update({
        name: ownerData.name,
        email: ownerData.email,
        phone: ownerData.phone,
        updated_at: new Date().toISOString()
      })
      .eq('id', params.id)
      .select()
      .single();
      
    if (error) throw error;
    
    return NextResponse.json(updatedOwner);
  } catch (error) {
    console.error(`Error updating owner ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to update owner' },
      { status: 500 }
    );
  }
}

// DELETE /api/owners/[id] - Delete an owner
export async function DELETE(request: Request, { params }: Params) {
  const supabase = createRouteHandlerClient({ cookies });
  
  try {
    const { error } = await supabase
      .from('owners')
      .delete()
      .eq('id', params.id);
      
    if (error) throw error;
    
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error(`Error deleting owner ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to delete owner' },
      { status: 500 }
    );
  }
}
