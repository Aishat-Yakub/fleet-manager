import { supabase } from '@/lib/supabase';
import { LoginCredentials, User } from '@/types/user';

export const authService = {
  async login(credentials: LoginCredentials): Promise<User> {
    // Call the Supabase RPC function
    const { data, error } = await supabase.rpc('login_user', {
      p_username: credentials.username,
      p_password: credentials.password,
    });

    if (error) {
      console.error('Supabase login error:', error.message);
      throw new Error(error.message);
    }

    if (!data || data.length === 0) {
      throw new Error('Login failed: Invalid username or password.');
    }

    // Ensure correct typing for bigint ID
    const user: User = {
      ...data[0],
      id: Number(data[0].id), // Convert bigint → number for frontend use
    };

    return user;
  },

  async logout(): Promise<void> {
    // For custom auth: just clear session/client state
    return Promise.resolve();
  },
};
