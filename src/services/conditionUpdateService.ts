import { supabase } from '@/lib/supabase';
import { ConditionUpdate, CreateConditionUpdatePayload } from '@/types/conditionUpdate';

export const conditionUpdateService = {
  async getConditionUpdates(ownerId: string): Promise<ConditionUpdate[]> {
    const { data, error } = await supabase
      .from('condition_updates')
      .select('*')
      .eq('owner_id', ownerId);

    if (error) {
      console.error('Error fetching condition updates:', error);
      throw new Error(error.message);
    }

    return data || [];
  },

  async createConditionUpdate(payload: CreateConditionUpdatePayload): Promise<ConditionUpdate> {
    const { data, error } = await supabase
      .from('condition_updates')
      .insert(payload)
      .select();

    if (error) {
      console.error('Error creating condition update:', error);
      throw new Error(error.message);
    }

    if (!data || data.length === 0) {
      throw new Error('Condition update creation failed.');
    }

    return data[0];
  },
};
