'use client';

import React from 'react';
import { Users, Car, Clock, CheckCircle } from 'lucide-react';
import Link from 'next/link';

type StatCardProps = { title: string; value: string | number; icon: React.ReactNode };

const StatCard = ({ title, value, icon }: StatCardProps) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-gray-500 text-sm font-medium">{title}</p>
        <p className="text-2xl font-bold mt-1">{value}</p>
      </div>
      <div className="p-2 bg-blue-50 rounded-lg">{icon}</div>
    </div>
  </div>
);

export default function AdminDashboard() {
  // Mock data
  const stats = [
    { title: 'Total Users', value: '24', icon: <Users className="h-5 w-5 text-blue-600" /> },
    { title: 'Total Vehicles', value: '42', icon: <Car className="h-5 w-5 text-green-600" /> },
    { title: 'Pending Requests', value: '5', icon: <Clock className="h-5 w-5 text-yellow-600" /> },
    { title: 'Completed Trips', value: '128', icon: <CheckCircle className="h-5 w-5 text-green-600" /> },
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
        <p className="text-gray-600">Welcome back! Here&apos;s an overview of what&apos;s happening with your fleet.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatCard 
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
          />
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Recent Activity</h2>
          <Link href="/admin/activity" className="text-sm text-blue-600 hover:text-blue-800">
            View All
          </Link>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-full">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">New user registered</p>
                <p className="text-xs text-gray-500">5 minutes ago</p>
              </div>
            </div>
            <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">New</span>
          </div>
        </div>
      </div>
    </div>
  );
  
}
