import { supabase } from "../lib/supabaseClient";

type UserWithRole = {
  id: string;
  email: string;
  password: string;
  role_id: number;
  roles: { role_name: string };
};

export async function login(email: string, password: string) {
  try {
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, email, password, role_id, roles(role_name)')
      .eq('email', email)
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
      email: user.email,
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
