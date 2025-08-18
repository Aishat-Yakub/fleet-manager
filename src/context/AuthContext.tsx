"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { authService } from '@/services/authService';
import { LoginCredentials, User } from '@/types/user';
import { useRouter } from 'next/navigation';

type AuthContextType = {
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);

    try {
      const loggedInUser = await authService.login(credentials);
      setUser(loggedInUser);

      // Role-based redirect
      switch (loggedInUser.role) {
        case 'admin':
          router.push('/admin/dashboard');
          break;
        case 'manager':
          router.push('/manager');
          break;
        case 'owner':
          router.push('/owners');
          break;
        case 'auditor':
          router.push('/auditor');
          break;
        default:
          router.push('/');
      }

    } catch (err: any) {
      console.error('Login failed:', err);
      setError(err.message || 'Login failed. Check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
