// src/services/authService.ts
import { supabase } from '@/lib/supabase';
import { LoginCredentials, User } from '@/types/user';

export const authService = {
  /**
   * Logs in a user by calling the Supabase RPC function `validate_login`
   * Handles hashed passwords
   */
  async login(credentials: LoginCredentials): Promise<User> {
    const { data, error } = await supabase.rpc('validate_login', {
      p_username: credentials.username,
      p_password: credentials.password,
    });

    if (error) {
      console.error('Supabase login RPC error:', error.message);
      throw new Error('Login failed. Please try again.');
    }

    if (!data || data.length === 0) {
      throw new Error('Invalid username or password.');
    }

    // Supabase RPC returns an array, take the first row
    const userRow = data[0] as any;

    // Construct a User object
    const user: User = {
      id: Number(userRow.user_id),
      name: userRow.user_name,
      email: userRow.user_email,
      username: credentials.username,
      role: userRow.user_role,
      status: 'active',
      created_at: ''
    };

    return user;
  },

  /**
   * Logs out the current user
   */
  async logout(): Promise<void> {
    // Clear session if using Supabase auth
    return Promise.resolve();
  },
};
