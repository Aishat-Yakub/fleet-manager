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
    .from("users")
    .select("id, email, role_id, roles(role_name)");

  if (error) throw new Error(error.message);
  return data;
}

// Create new user
export async function createUser(email: string, password: string, role_id: number) {
  const { data, error } = await supabase
    .from("users")
    .insert([{ email, password, role_id }])
    .select("id, email, role_id");

  if (error) throw new Error(error.message);
  return data?.[0];
}

// Update user role
export async function updateUserRole(userId: string, role_id: number) {
  const { data, error } = await supabase
    .from("users")
    .update({ role_id })
    .eq("id", userId)
    .select("id, email, role_id");

  if (error) throw new Error(error.message);
  return data?.[0];
}

// Delete user
export async function deleteUser(userId: string) {
  const { error } = await supabase.from("users").delete().eq("id", userId);
  if (error) throw new Error(error.message);
  return { success: true };
}
