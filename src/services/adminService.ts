import { supabase } from "../lib/supabaseClient";
import { User, UserWithRole, Role } from "@/types/type";
import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

/* ---------------- USERS CRUD ---------------- */

// Create
export async function createUser(vehicle_id: string, password: string, role_id: number) {
  const { data, error } = await supabase
    .from("users")
    .insert([{ vehicle_id, password, role_id }])
    .select("id, vehicle_id, role_id")
    .single();

  if (error) throw new Error(error.message);
  return data;
}

// Read all with roles
export async function getAllUsers(): Promise<UserWithRole[]> {
  const { data, error } = await supabase
    .from("users")
    .select("id, vehicle_id, role_id, created_at, roles(id, role_name)");

  if (error) throw new Error(error.message);
  return data as unknown as UserWithRole[];
}
// Update
export async function updateUser(id: string, updates: Partial<User>) {
  const { data, error } = await supabase
    .from("users")
    .update(updates)
    .eq("id", id)
    .select("id, email, role_id")
    .single();

  if (error) throw new Error(error.message);
  return data;
}

// Delete
export async function deleteUser(id: string) {
  const { error } = await supabase.from("users").delete().eq("id", id);
  if (error) throw new Error(error.message);
  return true;
}

/* ---------------- ROLES CRUD ---------------- */

// Create
export async function createRole(role_name: string) {
  const { data, error } = await supabase
    .from("roles")
    .insert([{ role_name }])
    .select("id, role_name")
    .single();

  if (error) throw new Error(error.message);
  return data;
}

// Read all
export async function getAllRoles(): Promise<Role[]> {
  const { data, error } = await supabase.from("roles").select("*");
  if (error) throw new Error(error.message);
  return data as Role[];
}

// Update
export async function updateRole(id: number, role_name: string) {
  const { data, error } = await supabase
    .from("roles")
    .update({ role_name })
    .eq("id", id)
    .select("id, role_name")
    .single();

  if (error) throw new Error(error.message);
  return data;
}

// Delete
export async function deleteRole(id: number) {
  const { error } = await supabase.from("roles").delete().eq("id", id);
  if (error) throw new Error(error.message);
  return true;
}

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies });
  const { data, error } = await supabase.from('users').select('*');
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data, { status: 200 });
}
