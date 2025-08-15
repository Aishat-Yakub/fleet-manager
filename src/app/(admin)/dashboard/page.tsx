'use client';

import React from 'react';
import { Users, Car, Clock, CheckCircle } from 'lucide-react';
import Link from 'next/link';

type StatCardProps = {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
};

const StatCard = ({ title, value, icon, trend }: StatCardProps) => (
  <div className="bg-white rounded-lg shadow p-6 flex flex-col">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-gray-500 text-sm font-medium">{title}</p>
        <p className="text-2xl font-bold mt-1">{value}</p>
      </div>
      <div className="p-2 bg-blue-50 rounded-lg">
        {icon}
      </div>
    </div>
    {trend && (
      <p className="text-sm mt-2 text-green-600">{trend}</p>
    )}
  </div>
);

type QuickActionProps = {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
};

const QuickAction = ({ title, description, icon, href }: QuickActionProps) => (
  <Link href={href}>
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow cursor-pointer">
      <div className="flex items-center space-x-4">
        <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
          {icon}
        </div>
        <div>
          <h3 className="font-medium">{title}</h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
    </div>
  </Link>
);

export default function DashboardPage() {
  // Mock data - replace with actual data from your API
  const stats = [
    {
      title: 'Total Users',
      value: '1,234',
      icon: <Users className="w-5 h-5 text-blue-600" />,
      trend: '+12% from last month',
    },
    {
      title: 'Active Vehicles',
      value: '42',
      icon: <Car className="w-5 h-5 text-green-600" />,
      trend: '+3 this week',
    },
    {
      title: 'Pending Requests',
      value: '8',
      icon: <Clock className="w-5 h-5 text-yellow-600" />,
    },
    {
      title: 'Completed Trips',
      value: '1,089',
      icon: <CheckCircle className="w-5 h-5 text-purple-600" />,
      trend: '24% increase',
    },
  ];

  const quickActions = [
    {
      title: 'Manage Users',
      description: 'View and manage all users',
      icon: <Users className="w-5 h-5" />,
      href: '/users',
    },
    {
      title: 'Add New Vehicle',
      description: 'Register a new vehicle to the fleet',
      icon: <Car className="w-5 h-5" />,
      href: '/vehicles/new',
    },
    {
      title: 'View Reports',
      description: 'Generate and view reports',
      icon: <CheckCircle className="w-5 h-5" />,
      href: '/reports',
    },
  ];

  return (
    <div className="w-full max-w-screen-xl xl:max-w-screen-2xl mx-auto px-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here&apos;s what&apos;s happening with your fleet.</p>
      </div>
  
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 text-black lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>
  
      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 text-black md:grid-cols-3 gap-6">
          {quickActions.map((action, index) => (
            <QuickAction key={index} {...action} />
          ))}
        </div>
      </div>
  
      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
        <div className="text-center py-8 text-gray-500">
          <p>Recent activities will appear here</p>
        </div>
      </div>
    </div>
  );
  
}
