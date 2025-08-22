export type Role = {
    id: number;
    role_name: string;
  };
  
  export type User = {
    id: string;
    email: string;
    password: string;
    role_id: number;
    created_at: string;
  };
  
  export type UserWithRole = User & { roles: Role };
  