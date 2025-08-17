import { supabase } from '../lib/supabase';

// Define and export the Owner type
export type Owner = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  created_at: string;
};

export type CreateOwnerPayload = Omit<Owner, 'id' | 'created_at'>;

export const ownerService = {
  async getOwners(): Promise<Owner[]> {
    const { data, error } = await supabase.from('owners').select('*');
    if (error) throw new Error(error.message);
    return data || [];
  },

  async createOwner(payload: CreateOwnerPayload): Promise<Owner> {
    const { data, error } = await supabase
      .from('owners')
      .insert(payload)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  },
};
