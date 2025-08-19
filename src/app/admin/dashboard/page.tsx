'use client';

import React, { useEffect, useState } from 'react';
import { Users, Car, Clock, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { User } from '@/types/user';
import { Vehicle } from '@/types/vehicle';

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
  const [users] = useState<User[]>([]);
  const [vehicles] = useState<Vehicle[]>([]);
  const [pendingFuelRequests] = useState(0);
  const [pendingMaintenanceRequests] = useState(0);
  const [isLoading] = useState(false);
  const [error] = useState<string | null>(null);

  // Mock data - replace with actual data fetching logic
  const mockUsers: User[] = [
    { id: '1', name: 'Admin User', email: 'admin@example.com', role: 'admin', status: 'active', created_at: new Date().toISOString() },
  ];

  const mockVehicles: Vehicle[] = [
    { id: '1', make: 'Toyota', model: 'Camry', year: 2022, plateNumber: 'ABC123', status: 'available', created_at: new Date().toISOString() },
  ];

  // Use mock data
  const dashboardData = {
    users: mockUsers,
    vehicles: mockVehicles,
    pendingFuelRequests: 0,
    pendingMaintenanceRequests: 0,
  };

  if (isLoading) {
    return <div className="text-center p-8">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-500">Error: {error}</div>;
  }

  const stats = [
    { title: 'Total Users', value: users.length, icon: <Users className="w-5 h-5 text-blue-600" /> },
    { title: 'Total Vehicles', value: vehicles.length, icon: <Car className="w-5 h-5 text-green-600" /> },
    { title: 'Pending Requests', value: pendingRequests, icon: <Clock className="w-5 h-5 text-yellow-600" /> },
    { title: 'Completed Tasks', value: 'N/A', icon: <CheckCircle className="w-5 h-5 text-purple-600" /> },
  ];

  return (
    <div className="w-full max-w-screen-xl xl:max-w-screen-2xl mx-auto px-4">
     

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Recent Users</h2>
          <ul className="space-y-3">
            {users.slice(0, 5).map(user => (
              <li key={user.id} className="flex justify-between items-center text-sm">
                <span>{user.name} ({user.role})</span>
                <span className={`px-2 py-1 rounded-full text-xs ${user.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                  {user.status}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Recent Vehicles</h2>
          <ul className="space-y-3">
            {vehicles.slice(0, 5).map(vehicle => (
              <li key={vehicle.id} className="flex justify-between items-center text-sm">
                <span>{vehicle.model} - {vehicle.plate_number}</span>
                <span className={`px-2 py-1 rounded-full text-xs ${vehicle.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                  {vehicle.status}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
        <div className="text-center py-8 text-gray-500">
          <p>Recent activities will appear here</p>
        </div>
      </div>
    </div>
  );
  
}
