import { supabase } from "../lib/supabaseClient";

type User = {
  id: string;
  email: string;
  password: string;
  role_id: number;
};

// Fetch all users with roles
export async function getUsers() {
  const { data, error } = await supabase
    .from('users')
    .select(`
      id,
      email,
      role_id,
      created_at,
      roles (
        role_name
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching users:', error);
    throw new Error(error.message || 'Failed to fetch users');
  }

  return data || [];
}

// Create new user
export async function createUser(email: string, password: string, role_id: number) {
  const userData = {
    email,
    password,
    role_id,
    created_at: new Date().toISOString()
  };

  const { data, error } = await supabase
    .from('users')
    .insert([userData])
    .select('id, email, role_id, created_at')
    .single();

  if (error) {
    console.error('Error creating user:', error);
    throw new Error(error.message || 'Failed to create user');
  }

  return data;
}

// Update user role
export async function updateUserRole(userId: string, role_id: number) {
  const { data, error } = await supabase
    .from('users')
    .update({ 
      role_id,
      updated_at: new Date().toISOString() 
    })
    .eq('id', userId)
    .select('id, email, role_id, created_at');

  if (error) {
    console.error(`Error updating user ${userId} role:`, error);
    throw new Error(error.message || 'Failed to update user role');
  }
  
  return data?.[0];
}

// Delete user
export async function deleteUser(userId: string) {
  const { error } = await supabase
    .from('users')
    .delete()
    .eq('id', userId);
    
  if (error) {
    console.error(`Error deleting user ${userId}:`, error);
    throw new Error(error.message || 'Failed to delete user');
  }
  
  return { success: true, message: 'User deleted successfully' };
}
