import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Owner, OwnerFormData } from '@/types/type';

// GET /api/owners - Get all owners
export async function GET() {
  const supabase = createRouteHandlerClient({ cookies });
  
  try {
    const { data: owners, error } = await supabase
      .from('owners')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return NextResponse.json(owners);
  } catch (error) {
    console.error('Error fetching owners:', error);
    return NextResponse.json(
      { error: 'Failed to fetch owners' },
      { status: 500 }
    );
  }
}

// POST /api/owners - Create a new owner
export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  
  try {
    const ownerData: OwnerFormData = await request.json();
    
    const { data: newOwner, error } = await supabase
      .from('owners')
      .insert([{
        name: ownerData.name,
        email: ownerData.email,
        phone: ownerData.phone
      }])
      .select()
      .single();
      
    if (error) throw error;
    
    return NextResponse.json(newOwner, { status: 201 });
  } catch (error) {
    console.error('Error creating owner:', error);
    return NextResponse.json(
      { error: 'Failed to create owner' },
      { status: 500 }
    );
  }
}
