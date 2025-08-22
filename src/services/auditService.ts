import { supabase } from "../lib/supabaseClient";

export interface AuditLog {
  id: string;
  user_id: string;
  action: string;
  entity_type: 'user' | 'vehicle' | 'maintenance' | 'system';
  entity_id: string;
  old_value?: Record<string, any>;
  new_value?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

// Fetch all audit logs with optional filtering
export async function getAuditLogs({
  limit = 50,
  offset = 0,
  entity_type,
  action,
  user_id,
}: {
  limit?: number;
  offset?: number;
  entity_type?: string;
  action?: string;
  user_id?: string;
} = {}) {
  let query = supabase
    .from('audit_logs')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (entity_type) query = query.eq('entity_type', entity_type);
  if (action) query = query.eq('action', action);
  if (user_id) query = query.eq('user_id', user_id);

  const { data, error, count } = await query;

  if (error) throw new Error(error.message);
  return { data: data as AuditLog[], count: count || 0 };
}

// Create a new audit log
export async function createAuditLog(logData: Omit<AuditLog, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('audit_logs')
    .insert([logData])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as AuditLog;
}

// Get audit logs for a specific entity
export async function getEntityAuditLogs(entity_type: string, entity_id: string) {
  const { data, error } = await supabase
    .from('audit_logs')
    .select('*')
    .eq('entity_type', entity_type)
    .eq('entity_id', entity_id)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data as AuditLog[];
}

// Get user's activity logs
export async function getUserActivityLogs(user_id: string) {
  const { data, error } = await supabase
    .from('audit_logs')
    .select('*')
    .eq('user_id', user_id)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data as AuditLog[];
}
