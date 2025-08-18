import { supabase } from '../lib/supabase';

export type Profile = {
  full_name: string;
  avatar_url?: string;
};

export type AuditLog = {
  id: string;
  action: string;
  details: Record<string, any>;
  created_at: string;
  profiles: Profile[];
};

export const auditorService = {
  async getAuditTrail(): Promise<AuditLog[]> {
    const { data, error } = await supabase
      .from('audit_logs')
      .select(`
        id,
        action,
        details,
        created_at,
        profiles:user_id (full_name, avatar_url)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching audit trail:', error);
      throw new Error('Failed to fetch audit trail.');
    }

    return data || [];
  },
};
