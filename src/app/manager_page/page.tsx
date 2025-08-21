'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable, columns, FuelRequests, MaintenanceRequests } from './components';

import { Vehicle } from './types';

export default function ManagerDashboard() {

  const [vehicles] = useState<Vehicle[]>(() => [
    {
      id: '1',
      make: 'Toyota',
      model: 'Camry',
      year: 2022,
      plateNumber: 'ABC123',
      status: 'available',
      assignedTo: '1',
      currentMileage: 15000,
      lastServiceDate: '2023-10-15',
      nextServiceDue: '2024-04-15',
      fuelType: 'Petrol',
      fuelEfficiency: 14.5,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]);
  const [loading] = useState(false);

  return (
    <div className="min-h-screen bg-sky-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-sky-950">Vehicle Management Dashboard</h1>
        
        <Tabs defaultValue="vehicles" className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-md mb-8 bg-sky-100 p-1.5 rounded-full">
            <TabsTrigger 
              value="vehicles" 
              className="text-black hover:!text-black focus:!text-black data-[state=active]:bg-white data-[state=active]:text-black rounded-full transition-colors"
            >
              Vehicles
            </TabsTrigger>
            <TabsTrigger 
              value="fuel-requests" 
              className="text-black hover:!text-black focus:!text-black data-[state=active]:bg-white data-[state=active]:text-black rounded-full transition-colors"
            >
              Fuel Requests
            </TabsTrigger>
            <TabsTrigger 
              value="maintenance-requests" 
              className="text-black hover:!text-black focus:!text-black data-[state=active]:bg-white data-[state=active]:text-black rounded-full transition-colors"
            >
              Maintenance
            </TabsTrigger>
          </TabsList>

        <TabsContent value="vehicles" className="bg-white rounded-xl border border-gray-100 p-6">
          <Card className="border-0 shadow-none">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="text-sky-900">Vehicle Management</CardTitle>
            </CardHeader>
            <CardContent className="px-0">
              {loading ? (
                <div className="text-sky-600">Loading vehicles...</div>
              ) : (
                <DataTable 
                  columns={columns()} 
                  data={vehicles} 
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fuel-requests" className="bg-white rounded-xl border border-gray-100 p-6">
          <FuelRequests />
        </TabsContent>

        <TabsContent value="maintenance-requests" className="bg-white rounded-xl border border-gray-100 p-6">
          <MaintenanceRequests />
        </TabsContent>
      </Tabs>
    </div>
  </div>
  );
}
