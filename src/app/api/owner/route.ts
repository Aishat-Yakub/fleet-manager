import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

// Base URL for the API
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

// Helper function to handle API requests
async function fetchOwnerData(
  endpoint: string, 
  token: string, 
  options: RequestInit = {}
) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Failed to fetch data');
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// Helper to handle authentication
async function withAuth(handler: (request: Request, token: string) => Promise<Response>) {
  return async (request: Request) => {
    try {
      const session = await auth();
      if (!session?.user) {
        return NextResponse.json(
          { error: 'Unauthorized' }, 
          { status: 401 }
        );
      }
      
      const authToken = session.user.id; // Or your actual token field
      return await handler(request, authToken);
    } catch (error) {
      console.error('Authentication error:', error);
      return NextResponse.json(
        { error: 'Internal Server Error' },
        { status: 500 }
      );
    }
  };
}

// GET /api/owners/{ownerId}/condition-updates
export const GET = withAuth(async (request: Request, token: string) => {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '10';
    
    // Extract ownerId from the URL
    const url = new URL(request.url);
    const ownerId = url.pathname.split('/').filter(Boolean).pop();
    
    if (!ownerId) {
      return NextResponse.json(
        { error: 'Owner ID is required' },
        { status: 400 }
      );
    }
    
    const data = await fetchOwnerData(
      `/api/owners/${ownerId}/condition-updates?page=${page}&limit=${limit}`,
      token
    );
    
    return NextResponse.json(data);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
});

// POST /api/owners/{ownerId}/condition-updates
export const POST = withAuth(async (request: Request, token: string) => {
  try {
    // Extract ownerId from the URL
    const url = new URL(request.url);
    const ownerId = url.pathname.split('/').filter(Boolean).pop();
    
    if (!ownerId) {
      return NextResponse.json(
        { error: 'Owner ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const data = await fetchOwnerData(
      `/api/owners/${ownerId}/condition-updates`,
      token,
      {
        method: 'POST',
        body: JSON.stringify(body),
      }
    );
    
    return NextResponse.json(data, { status: 201 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
});
