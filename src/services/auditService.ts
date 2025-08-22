import { supabase } from "../lib/supabaseClient";

export interface AuditLog {
  log_id: string;
  type: string;
  request_id: string | null;
  changed_by: string;
  "Last Maintenance": string;
}

// Fetch all audit logs with optional filtering
export async function getAuditLogs({
  limit = 50,
  offset = 0,
  type,
  changed_by,
}: {
  limit?: number;
  offset?: number;
  type?: string;
  changed_by?: string;
} = {}) {
  let query = supabase
    .from('audit_logs')
    .select('*', { count: 'exact' })
    .order('"Last Maintenance"', { ascending: false })
    .range(offset, offset + limit - 1);

  if (type) query = query.eq('type', type);
  if (changed_by) query = query.eq('changed_by', changed_by);

  const { data, error, count } = await query;

  if (error) throw new Error(error.message);
  return { data: data as AuditLog[], count: count || 0 };
}

// Create a new audit log
export async function createAuditLog(logData: Omit<AuditLog, 'log_id'>) {
  const { data, error } = await supabase
    .from('audit_logs')
    .insert([logData])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as AuditLog;
}

// Get audit logs by type
export async function getAuditLogsByType(type: string) {
  const { data, error } = await supabase
    .from('audit_logs')
    .select('*')
    .eq('type', type)
    .order('"Last Maintenance"', { ascending: false });

  if (error) throw new Error(error.message);
  return data as AuditLog[];
}

// Get audit logs by user
export async function getAuditLogsByUser(userId: string) {
  const { data, error } = await supabase
    .from('audit_logs')
    .select('*')
    .eq('changed_by', userId)
    .order('"Last Maintenance"', { ascending: false });

  if (error) throw new Error(error.message);
  return data as AuditLog[];
}
