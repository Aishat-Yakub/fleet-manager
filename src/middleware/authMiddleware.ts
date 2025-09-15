import { supabase } from "../lib/supabaseClient";

type UserWithRole = {
  id: string;
  vehicle_id: string;
  password: string;
  role_id: number;
  roles: { role_name: string };
};

export async function login(vehicle_id: string, password: string) {
  try {
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, vehicle_id, password, role_id, roles(role_name)')
      .eq('vehicle_id', vehicle_id)
      .single<UserWithRole>();

    if (userError || !user) {
      console.error('User not found or error:', userError);
      throw new Error('Invalid credentials');
    }

    if (user.password !== password) {
      console.error('Password mismatch');
      throw new Error('Invalid credentials');
    }

    return {
      userId: user.id,
      vehicle_id: user.vehicle_id,
      role: user.roles?.role_name || null,
    };
  } catch (error) {
    console.error('Login error:', error);
    throw new Error('Invalid credentials');
  }
}

export function isOwner(role: string | null): boolean {
  return role === "owner";
}

export function isAdmin(role: string | null): boolean {
  return role === "admin";
}

export function isManager(role: string | null): boolean {
  return role === "manager";
}

export function isAuditor(role: string | null): boolean {
  return role === "auditor";
}

export function hasRole(role: string | null, allowed: string[]): boolean {
  return role !== null && allowed.includes(role);
}
