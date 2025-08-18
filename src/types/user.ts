export interface User {
  id: number; 
  name: string;
  email: string;
  username: string;
  role: string;
  status: string;
  created_at: string;
  password?: string;
  last_login?: string | null;
}



export interface LoginCredentials {
  username: string;
  password: string;
}

export type UserPayload = {
  name: string;
  email: string;
username: string;
  password?: string;
  role: 'admin' | 'manager' | 'owner' | 'auditor';
  status: 'active' | 'inactive' | 'suspended';
};
