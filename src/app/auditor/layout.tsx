'use client';

import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { ReactNode } from 'react';

export default function AuditorLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute requiredRole="auditor">
      <div className="flex h-screen bg-gray-100">
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
