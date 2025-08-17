import { supabase } from '@/lib/supabase';
import { User } from '@/types/user';

export type CreateUserPayload = Omit<User, 'id'> & { password?: string };

export const userService = {
  async getUsers(): Promise<User[]> {
    const { data, error } = await supabase.from('users').select('*');

    if (error) {
      console.error('Error fetching users:', error);
      throw new Error(error.message);
    }

    return data || [];
  },

  async createUser(userData: CreateUserPayload): Promise<User> {
    const { data, error } = await supabase.from('users').insert([userData]).select();

    if (error) {
      console.error('Error creating user:', error);
      throw new Error(error.message);
    }
    
    if (!data || data.length === 0) {
        throw new Error('User creation failed: No data returned.');
    }

    return data[0];
  },

  async updateUser(userId: string, userData: Partial<User>): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .update(userData)
      .eq('id', userId)
      .select();

    if (error) {
      console.error('Error updating user:', error);
      throw new Error(error.message);
    }
    
    if (!data || data.length === 0) {
        throw new Error('User update failed: No data returned.');
    }

    return data[0];
  },

  async deleteUser(userId: string): Promise<void> {
    const { error } = await supabase.from('users').delete().eq('id', userId);

    if (error) {
      console.error('Error deleting user:', error);
      throw new Error(error.message);
    }
  },
};
