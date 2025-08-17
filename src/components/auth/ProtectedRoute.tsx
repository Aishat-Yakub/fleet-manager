'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { User } from '@/types/user';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole: User['role'];
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return; // Wait for the auth state to be determined

    if (!user) {
      router.push('/login');
      return;
    }

    if (user.role !== requiredRole) {
      // Redirect to their default page if role doesn't match
      switch (user.role) {
        case 'admin':
          router.push('/admin/dashboard');
          break;
        case 'manager':
          router.push('/manager');
          break;
        case 'owner':
          router.push('/owners');
          break;
        default:
          router.push('/');
      }
    }
  }, [user, isLoading, requiredRole, router]);

  if (isLoading || !user || user.role !== requiredRole) {
    // Display a loading indicator or a blank screen while redirecting
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="text-xl font-semibold">Loading...</div>
        </div>
    );
  }

  return <>{children}</>;
}
