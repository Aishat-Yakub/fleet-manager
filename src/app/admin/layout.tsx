'use client';

import React from 'react';
import Sidebar from '@/components/admin/Sidebar';
import NotificationSidebar from '@/components/admin/NotificationSidebar';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute requiredRole="admin">
      <div className="min-h-screen bg-gray-50">
        <div className="flex h-screen overflow-hidden">
          {/* Sidebar */}
          <Sidebar />
          
          {/* Main content */}
          <div className="flex-1 overflow-auto">
            <main className="p-6 max-w-7xl mx-auto">
              {children}
            </main>
          </div>

          {/* Notification Sidebar */}
          <div className="hidden md:flex">
            <NotificationSidebar />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
