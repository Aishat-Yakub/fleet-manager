'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable, columns, FuelRequests, MaintenanceRequests } from './components';

import { Vehicle } from './types';
import { getVehicles } from '@/services/managerService';
import Logo from '@/app/assets/logo/Logo.jpg'
import Image from 'next/image';

export default function ManagerDashboard() {

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const data = await getVehicles();
        setVehicles(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching vehicles:', error);
        setLoading(false);
      }
    };
    fetchVehicles();
  }, []);

  return (
    <div className="min-h-screen bg-sky-50 py-8">
      <div className="container mx-auto px-4">
      <div className="flex items-center h-16 flex-shrink-0 px-6 border-b border-gray-200">
          <h1 className="text-2xl flex justify-center items-center gap-2 font-bold text-gray-900">
            <Image
              src={Logo}
              alt="Fleet Manager Logo"
              width={80}
              height={80}
              className='h-16 w-auto rounded-full object-cover'
            />
            <span>Vehicle Management Dashboard</span>
          </h1>
        </div>
        
        <Tabs defaultValue="vehicles" className="w-full mt-8">
          <TabsList className="grid w-full grid-cols-3 max-w-md mb-8 bg-blue-300 p-1.5 rounded-full">
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

        <TabsContent value="vehicles" className="bg-transparent hover:bg-sky-50 rounded-xl border border-sky-950/40 p-6">
          <Card className="border-0 shadow-none">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="text-sky-900">Vehicle Management</CardTitle>
            </CardHeader>
            <CardContent className="px-0">
              {loading ? (
                <div className="text-sky-600">Loading vehicles...</div>
              ) : (
                <DataTable 
                  columns={columns(async () => {
                    setLoading(true);
                    try {
                      const data = await getVehicles();
                      setVehicles(data);
                    } catch (error) {
                      console.error('Error fetching vehicles:', error);
                    } finally {
                      setLoading(false);
                    }
                  })} 
                  data={vehicles} 
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fuel-requests" className="bg-transparent hover:bg-sky-50 rounded-xl border border-sky-950/40 p-6">
          <FuelRequests />
        </TabsContent>

        <TabsContent value="maintenance-requests" className="bg-transparent hover:bg-sky-50 rounded-xl border border-sky-950/40 p-6">
          <MaintenanceRequests />
        </TabsContent>
      </Tabs>
    </div>
  </div>
  );
}
