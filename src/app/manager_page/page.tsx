'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable, columns, FuelRequests, MaintenanceRequests } from './components';
import { getConditionUpdates, updateConditionStatus } from '@/services/conditionService';
import { Vehicle } from './types';
import { Check, X } from 'lucide-react';
import Logo from '@/app/assets/logo/Logo.jpg'
import Image from 'next/image';

export default function ManagerDashboard() {

  const [conditionUpdates, setConditionUpdates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<number | null>(null);

  const fetchConditionUpdates = async () => {
    try {
      const data = await getConditionUpdates();
      setConditionUpdates(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching condition updates:', error);
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: number, status: 'approved' | 'rejected') => {
    try {
      setProcessing(id);
      await updateConditionStatus(id, status);
      await fetchConditionUpdates();
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setProcessing(null);
    }
  };

  useEffect(() => {
    fetchConditionUpdates();
  }, []);

  return (
    <div className="min-h-screen bg-sky-50 py-8">
      <div className="container mx-auto px-4">
      <div className="flex items-center h-16 flex-shrink-0 px-6 border-b border-gray-200">
          <h1 className="text-xl md:text-2xl flex justify-center items-center gap-2 font-bold text-gray-900">
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
              Condition
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
              <CardTitle className="text-sky-900">Condition Updates</CardTitle>
            </CardHeader>
            <CardContent className="px-0">
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div>
                </div>
              ) : conditionUpdates.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No condition updates found</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="text-sky-950">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Vehicle ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Condition
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {conditionUpdates.map((update) => (
                        <tr key={update.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {update.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                            {update.vehicle_id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              update.conditon === 'Good' ? 'bg-green-100 text-green-800' :
                              update.conditon === 'Fair' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {update.conditon}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              update.status === 'approved' ? 'bg-green-100 text-green-800' :
                              update.status === 'rejected' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {update.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(update.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                            {update.status === 'pending' && (
                              <div className="flex justify-end space-x-2">
                                <button
                                  onClick={() => handleStatusUpdate(update.id, 'approved')}
                                  disabled={processing === update.id}
                                  className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                                >
                                  <Check className="h-4 w-4 mr-1" /> Approve
                                </button>
                                <button
                                  onClick={() => handleStatusUpdate(update.id, 'rejected')}
                                  disabled={processing === update.id}
                                  className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                                >
                                  <X className="h-4 w-4 mr-1" /> Reject
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
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
