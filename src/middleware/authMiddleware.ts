import { supabase } from "../lib/supabaseClient";

// Define the expected User + Role shape
type UserWithRole = {
  id: string;
  email: string;
  role_id: number;
  roles: { role_name: string };
};

// Login function
export async function login(email: string, password: string) {
  const { data, error } = await supabase
    .from("users")
    .select("id, email, role_id, roles(role_name)") // select role_name properly
    .eq("email", email)
    .eq("password", password)
    .single<UserWithRole>();

  if (error || !data) throw new Error("Invalid credentials");

  return {
    userId: data.id,
    email: data.email,
    role: data.roles?.role_name || null, // safe access
  };
}

// Role check helpers
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

// Generic role guard
export function hasRole(role: string | null, allowed: string[]): boolean {
  return role !== null && allowed.includes(role);
}
