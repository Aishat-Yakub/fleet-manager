'use client';
import Image from 'next/image';
import Logo from '@/app/assets/logo/Logo.jpg';


import Sidebar from '@/components/admin/Sidebar';
import NotificationSidebar from '@/components/admin/NotificationSidebar';
import React, { useState } from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile header */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 border-b bg-white sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <Image
            src={Logo}
            alt="Fleet Manager Logo"
            width={40}
            height={40}
            className="h-10 w-10 rounded-full object-cover"
            priority
          />
          <span className="font-bold text-sky-950">LASU Fleet</span>
        </div>
        <button
          aria-label="Open sidebar"
          className="text-gray-700 focus:outline-none"
          onClick={() => setSidebarOpen(true)}
        >
          <svg className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden justify-end">
          <div className="fixed inset-0 bg-white/70 backdrop-blur-sm transition-all duration-200" onClick={() => setSidebarOpen(false)}></div>
          <div className="relative w-64 bg-white h-full shadow-xl z-50 animate-slideInRight">
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex h-[calc(100vh-0px)] overflow-hidden flex-row-reverse">
        {/* Desktop Sidebar on the right */}
        <div className="hidden lg:flex lg:flex-shrink-0">
          <Sidebar />
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-auto">
          <main className="p-4 sm:p-6 max-w-7xl mx-auto w-full flex-1">
            {children}
          </main>
        </div>

        {/* Notification Sidebar (desktop only) */}
        <div className="hidden md:flex">
          <NotificationSidebar />
        </div>
      </div>
    </div>
  );
}
