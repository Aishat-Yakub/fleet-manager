'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { managerService } from '@/services/managerService';
import { DataTable, columns, FuelRequests, MaintenanceRequests } from './components';

import { Vehicle } from './types';

export default function ManagerDashboard() {

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const data = await managerService.getVehicles() as Vehicle[];
        setVehicles(data);
      } catch (error) {
        console.error('Error fetching vehicles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  const handleStatusUpdate = async (vehicleId: string, status: string) => {
    try {
      await managerService.updateVehicleStatus(vehicleId, status);
      // Refresh the vehicles list
      const updatedVehicles = await managerService.getVehicles() as Vehicle[];
      setVehicles(updatedVehicles);
    } catch (error) {
      console.error('Error updating vehicle status:', error);
    }
  };

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
                  columns={columns(handleStatusUpdate)} 
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
