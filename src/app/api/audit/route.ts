import { NextResponse } from 'next/server';
import { getAuditLogs, getAuditLogsByType, getAuditLogsByUser } from '@/services/auditService';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    const limit = Math.min(parseInt(searchParams.get('limit') || '50', 10), 100);
    const offset = parseInt(searchParams.get('offset') || '0', 10);
    const type = searchParams.get('type') || undefined;
    const changedBy = searchParams.get('changed_by') || undefined;
    
    try {
      // Get logs by type
      if (type) {
        const logs = await getAuditLogsByType(type);
        return NextResponse.json(logs);
      }
      
      // Get logs by user
      if (changedBy) {
        const logs = await getAuditLogsByUser(changedBy);
        return NextResponse.json(logs);
      }
      
      // Get all logs with optional filters
      const { data, count } = await getAuditLogs({
        limit,
        offset,
        type,
        changed_by: changedBy
      });
      
      return NextResponse.json({
        data,
        pagination: {
          total: count,
          limit,
          offset,
          hasMore: offset + limit < (count || 0)
        }
      });
    } catch (error: unknown  ) {
      console.error('Error in audit GET handler:', error);
      throw error;
    }
  } catch (error: unknown) {
    console.error('Audit API Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch audit logs',
  details: process.env.NODE_ENV === 'development' && error instanceof Error ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const logData = await request.json();
    
    // Basic validation
    if (!logData.type || !logData.changed_by) {
      return NextResponse.json(
        { error: 'Missing required fields (type, changed_by)' },
        { status: 400 }
      );
    }
    
    const { createAuditLog } = await import('@/services/auditService');
    
    // Ensure Last Maintenance is set to current time if not provided
    const logEntry = {
      ...logData,
      'Last Maintenance': logData['Last Maintenance'] || new Date().toISOString(),
      request_id: logData.request_id || null
    };
    
    const log = await createAuditLog(logEntry);
    
    return NextResponse.json(log, { status: 201 });
    
  } catch (error: unknown) {
    console.error('Error creating audit log:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create audit log',
  details: process.env.NODE_ENV === 'development' && error instanceof Error ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
