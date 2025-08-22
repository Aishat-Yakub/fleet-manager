import { NextResponse } from 'next/server';
import { getAuditLogs, getEntityAuditLogs, getUserActivityLogs } from '@/services/auditService';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const entityType = searchParams.get('entity_type') || undefined;
    const action = searchParams.get('action') || undefined;
    const userId = searchParams.get('user_id') || undefined;
    const entityId = searchParams.get('entity_id');
    
    // Get logs for a specific entity
    if (entityType && entityId) {
      const logs = await getEntityAuditLogs(entityType, entityId);
      return NextResponse.json(logs);
    }
    
    // Get activity logs for a specific user
    if (userId) {
      const logs = await getUserActivityLogs(userId);
      return NextResponse.json(logs);
    }
    
    // Get all logs with optional filters
    const { data, count } = await getAuditLogs({
      limit,
      offset,
      entity_type: entityType,
      action,
      user_id: userId
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
    
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch audit logs' },
      { status: 500 }
    );
  }
}

// Create a new audit log (typically used internally, not directly by the frontend)
export async function POST(request: Request) {
  try {
    const logData = await request.json();
    const { createAuditLog } = await import('@/services/auditService');
    const log = await createAuditLog(logData);
    return NextResponse.json(log, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create audit log' },
      { status: 500 }
    );
  }
}
