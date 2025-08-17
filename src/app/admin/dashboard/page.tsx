'use client';

import React, { useEffect, useState } from 'react';
import { Users, Car, Clock, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { userService } from '@/services/userService';
import { vehicleService } from '@/services/vehicleService';
import { fuelRequestService } from '@/services/fuelRequestService';
import { maintenanceRequestService } from '@/services/maintenanceRequestService';
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

export default function DashboardPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [pendingRequests, setPendingRequests] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [usersData, vehiclesData, fuelRequestsData, maintenanceRequestsData] = await Promise.all([
          userService.getUsers(),
          vehicleService.getVehicles(),
          fuelRequestService.getFuelRequests(),
          maintenanceRequestService.getMaintenanceRequests(),
        ]);
        setUsers(usersData);
        setVehicles(vehiclesData);
        const pendingFuel = fuelRequestsData.filter(r => r.status === 'pending').length;
        const pendingMaintenance = maintenanceRequestsData.filter(r => r.status === 'pending').length;
        setPendingRequests(pendingFuel + pendingMaintenance);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

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
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your fleet.</p>
      </div>

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
