'use client';

import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FileUp, Plus } from 'lucide-react';

// Add type definitions for the mock data
interface ConditionUpdate {
  id: number;
  date: string;
  status: string;
  notes: string;
}

interface FuelRequest {
  id: number;
  date: string;
  status: string;
  amount: string;
  vehicle: string;
}

// Mock data - replace with actual API calls
const mockConditionUpdates: ConditionUpdate[] = [
  { id: 1, date: '2025-08-01', status: 'Good', notes: 'Regular checkup' },
  { id: 2, date: '2025-07-15', status: 'Needs Attention', notes: 'Oil change needed' },
];

const mockFuelRequests: FuelRequest[] = [
  { id: 1, date: '2025-08-05', status: 'Pending', amount: '50L', vehicle: 'Toyota Camry' },
  { id: 2, date: '2025-07-20', status: 'Approved', amount: '30L', vehicle: 'Honda Accord' },
];

export default function OwnerDashboard() {
  const [activeTab, setActiveTab] = useState('condition');
  const [newConditionUpdate, setNewConditionUpdate] = useState({
    vehicleId: '',
    status: 'Good',
    notes: '',
  });

  const handleConditionSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: Implement API call
    console.log('Submitting condition update:', newConditionUpdate);
    // Reset form
    setNewConditionUpdate({ vehicleId: '', status: 'Good', notes: '' });
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // TODO: Implement file upload
      console.log('Uploading file:', file.name);
    }
  };

  return (
    <div className="min-h-screen bg-sky-50 text-sky-950">
      <div className="container mx-auto p-4 sm:p-6 max-w-7xl">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Vehicle Management Dashboard</h1>
      
      <Tabs defaultValue="condition" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-4 px-1 sm:px-0">
          <TabsTrigger 
            value="condition" 
            className='text-sm sm:text-base md:text-lg text-sky-950 border border-sky-950 p-1 sm:p-2 whitespace-nowrap' 
            onClick={() => setActiveTab('condition')}
          >
            Condition
          </TabsTrigger>
          <TabsTrigger 
            value="fuel" 
            className='text-sm sm:text-base md:text-lg text-sky-950 border border-sky-950 p-1 sm:p-2 whitespace-nowrap' 
            onClick={() => setActiveTab('fuel')}
          >
            Fuel
          </TabsTrigger>
          <TabsTrigger 
            value="maintenance" 
            className='text-sm sm:text-base md:text-lg text-sky-950 border border-sky-950 p-1 sm:p-2 whitespace-nowrap' 
            onClick={() => setActiveTab('maintenance')}
          >
            Maintenance
          </TabsTrigger>
          <TabsTrigger 
            value="inspections" 
            className='text-sm sm:text-base md:text-lg text-sky-950 border border-sky-950 p-1 sm:p-2 whitespace-nowrap' 
            onClick={() => setActiveTab('inspections')}
          >
            Inspections
          </TabsTrigger>
        </TabsList>

        {/* Condition Updates Tab */}
        <TabsContent value="condition">
          <Card>
            <CardHeader>
              <CardTitle>Vehicle Condition Updates</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleConditionSubmit} className="space-y-4 mb-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="vehicleId" className="text-sky-950">Vehicle ID</Label>
                    <Input
                      id="vehicleId"
                      value={newConditionUpdate.vehicleId}
                      onChange={(e) =>
                        setNewConditionUpdate({ ...newConditionUpdate, vehicleId: e.target.value })
                      }
                      className="bg-sky-200/20 border-sky-950/50 focus-visible:ring-sky-500"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="status" className="text-sky-950">Status</Label>
                    <select
                      id="status"
                      className="flex h-10 w-full rounded-md bg-sky-200/20 border-sky-950/50 border px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={newConditionUpdate.status} 
                      onChange={(e) =>
                        setNewConditionUpdate({ ...newConditionUpdate, status: e.target.value })
                      }
                    >
                      <option value="Good">Good</option>
                      <option value="Needs Attention">Needs Attention</option>
                      <option value="Maintenance Required">Maintenance Required</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="notes" className="text-sky-950">Notes</Label>
                    <Textarea
                      id="notes"
                      value={newConditionUpdate.notes}
                      onChange={(e) =>
                        setNewConditionUpdate({ ...newConditionUpdate, notes: e.target.value })
                      }
                      className="min-h-[80px] bg-sky-200/20 border-sky-950/50 focus-visible:ring-sky-500"
                    />
                  </div>
                </div>
                <Button 
                  type="submit" 
                  className="w-full sm:w-auto bg-blue-600 text-white hover:bg-blue-700"
                >
                  <Plus className="mr-2 h-4 w-4" /> 
                  <span className="hidden sm:inline">Add</span> Update
                </Button>
              </form>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Recent Updates</h3>
                {mockConditionUpdates.map((update) => (
                  <div key={update.id} className="border rounded-lg p-4">
                    <div className="flex justify-between">
                      <span className="font-medium text-sky-950">{update.date}</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        update.status === 'Good' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {update.status}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-sky-900">{update.notes}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Fuel Requests Tab */}
        <TabsContent value="fuel">
          <Card>
            <CardHeader>
              <CardTitle>Fuel Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-end mb-4">
                <Button className="bg-blue-600 text-white hover:bg-blue-700 w-full sm:w-auto">
                  <Plus className="mr-2 h-4 w-4" /> 
                  <span className="hidden sm:inline">New</span> Fuel Request
                </Button>
              </div>
              
              <div className="space-y-4">
                {mockFuelRequests.map((request) => (
                  <div key={request.id} className="border rounded-lg p-4">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium text-sky-950">{request.vehicle}</p>
                        <p className="text-sm text-sky-800">{request.amount} • {request.date}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        request.status === 'Approved' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {request.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Maintenance Tab */}
        <TabsContent value="maintenance">
          <Card>
            <CardHeader>
              <CardTitle>Maintenance Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-end mb-4">
                <Button className="bg-blue-600 text-white hover:bg-blue-700">
                  <Plus className="mr-2 h-4 w-4" /> New Maintenance Request
                </Button>
              </div>
              <p className="text-center text-gray-500 py-8">No maintenance requests found</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Inspections Tab */}
        <TabsContent value="inspections">
          <Card>
            <CardHeader>
              <CardTitle>Inspection Files</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <FileUp className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-sm text-gray-600 mb-4">
                  Drag and drop your inspection files here, or click to browse
                </p>
                <Input
                  type="file"
                  id="inspection-files"
                  className="hidden"
                  onChange={handleFileUpload}
                />
                <Label
                  htmlFor="inspection-files"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 cursor-pointer"
                >
                  Upload Files
                </Label>
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-4">Uploaded Files</h3>
                <p className="text-center text-gray-500 py-4">No files uploaded yet</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
    </div>
  );
}
