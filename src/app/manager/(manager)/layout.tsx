'use client';

import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { ReactNode } from 'react';

// NOTE: For a real application, you'd likely have a unique sidebar for managers
// For now, we'll use a simple layout structure.

export default function ManagerLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute requiredRole="manager">
      <div className="flex h-screen bg-gray-100">
        {/* A manager-specific sidebar could be placed here */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
