'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getConditionUpdates, updateConditionStatus } from '@/services/conditionService';
import { FuelRequests } from './components/fuel-requests';
import { MaintenanceRequests } from './components/maintenance-requests';

export interface ConditionUpdate {
  id: number;
  name: string;
  vehicle_id: string;
  conditon: 'Good' | 'Fair' | 'Poor';
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  notes?: string;
}

export default function ManagerDashboard() {

  const [updates, setUpdates] = useState<ConditionUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<number | null>(null);

  const fetchConditionUpdates = async () => {
    try {
      const data = await getConditionUpdates();
      setUpdates(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching condition updates:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConditionUpdates();
  }, []);

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

  return (
    <div className="min-h-screen py-8 bg-white/60 backdrop-blur-lg">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-sky-950">Vehicle Management Dashboard</h1>
        
        <Tabs defaultValue="condition-updates" className="w-full">
          <TabsList className="w-full flex flex-wrap justify-start md:justify-center mb-6">
            <TabsTrigger value="condition-updates">Condition Updates</TabsTrigger>
            <TabsTrigger value="fuel-requests">Fuel Requests</TabsTrigger>
            <TabsTrigger value="maintenance-requests">Maintenance</TabsTrigger>
          </TabsList>

          <TabsContent value="condition-updates" className="bg-white/60 backdrop-blur-lg rounded-xl border border-sky-950/40 p-6">
            <Card className="border-0 shadow-none">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="text-sky-900">Vehicle Condition Updates</CardTitle>
              </CardHeader>
              <CardContent className="px-0">
                {loading ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div>
                  </div>
                ) : updates.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No condition updates found</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50 font-bold">
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
                        {updates.map((update) => (
                          <tr key={update.id} className="">
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
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => handleStatusUpdate(update.id, 'approved')}
                                    disabled={processing === update.id}
                                    className="px-3 py-2 text-xs font-bold text-white-700 bg-blue-500 rounded-md hover:bg-blue-600 disabled:opacity-50"
                                  >
                                    Approve
                                  </button>
                                  <button
                                    onClick={() => handleStatusUpdate(update.id, 'rejected')}
                                    disabled={processing === update.id}
                                    className="px-3 py-2 text-xs font-bold text-white bg-red-500 rounded-md hover:bg-red-600 disabled:opacity-50"
                                  >
                                    Reject
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

          <TabsContent value="fuel-requests">
            <Card className="border-0 shadow-none">
              <CardContent className="px-0">
                <FuelRequests />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="maintenance-requests">
            <Card className="border-0 shadow-none">
              <CardContent className="px-0">
                <MaintenanceRequests />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
