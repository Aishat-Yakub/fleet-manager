"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

type User = {
  id: string;
  name: string;
  email: string;
  username: string;
  role: string;
  status: string;
  created_at: string;
};

type AuthContextType = {
  user: User | null;
  login: (credentials: { username: string; password: string }) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async ({ username, password }: { username: string; password: string }) => {
    setIsLoading(true);
    setError(null);

    try {
      // TODO: Replace with real API call
      const fakeUser: User = {
        id: "1", // 🔹 keep as string to match type
        name: "John Doe",
        email: "john@example.com",
        username,
        role: "admin",
        status: "active",
        created_at: new Date().toISOString(),
      };

      setUser(fakeUser);
    } catch (err) {
      setError("Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Exported hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
