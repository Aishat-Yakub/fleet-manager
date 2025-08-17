'use client';

import { useState, useEffect, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, UploadCloud, File as FileIcon, X, Wrench, ArrowLeft } from 'lucide-react';
import { ConditionUpdates } from '@/components/condition-updates';
import { FuelRequest, MaintenanceRequest } from './types';

const OwnerDashboard = () => {
  const [activeTab, setActiveTab] = useState('condition');
  const [newConditionUpdate, setNewConditionUpdate] = useState({ vehicleId: '', status: 'Good', notes: '' });
  const [fuelRequests, setFuelRequests] = useState<FuelRequest[]>([]);
  const [maintenanceRequests, setMaintenanceRequests] = useState<MaintenanceRequest[]>([]);
  const [showFuelRequestForm, setShowFuelRequestForm] = useState(false);
  const [newFuelRequest, setNewFuelRequest] = useState({ vehicleId: '', amount: '', notes: '' });
  const [newMaintenanceRequest, setNewMaintenanceRequest] = useState({
    vehicleId: '',
    issue: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
  });

  const handleConditionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setNewConditionUpdate({ vehicleId: '', status: 'Good', notes: '' });
  };

  const handleFuelRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRequest = {
      id: Date.now(),
      date: new Date().toISOString(),
      status: 'Pending',
      vehicleId: newFuelRequest.vehicleId,
      amount: newFuelRequest.amount,
      notes: newFuelRequest.notes,
      vehicle: '',
    };
    setFuelRequests(prev => [...prev, newRequest]);
    setNewFuelRequest({ vehicleId: '', amount: '', notes: '' });
    setShowFuelRequestForm(false);
  };

  const handleMaintenanceRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRequest = {
      id: Date.now(),
      vehicleId: parseInt(newMaintenanceRequest.vehicleId, 10),
      issue: newMaintenanceRequest.issue,
      priority: newMaintenanceRequest.priority,
      status: 'pending' as 'pending' | 'in-progress' | 'completed' | 'rejected',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      vehicle: undefined,
    };
    setMaintenanceRequests(prev => [...prev, newRequest]);
    setNewMaintenanceRequest({
      vehicleId: '',
      issue: '',
      priority: 'medium',
    });
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <div className="min-h-screen bg-sky-50 flex flex-col items-center pt-20">
      <div className="w-full max-w-7xl p-6 sm:p-8 md:border md:border-black rounded-lg mt-4">
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            size="sm"
            className="text-sky-600 hover:bg-sky-100"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-sky-950">Vehicle Management Dashboard</h1>
        </div>

        <Tabs 
          value={activeTab} 
          onValueChange={handleTabChange} 
          className="w-full"
        >
          {/* tab-section */}
          <TabsList 
            className="border border-sky-950 font-bold rounded-lg grid w-full grid-cols-2 sm:grid-cols-3 gap-0 mb-8 p-1 hover:text-sky-950"
            aria-label="Vehicle management sections"
          >
            <TabsTrigger 
              value="condition" 
              className="hover:bg-sky-50 hover:text-sky-950 transition-colors text-sky-950"
            >
              Condition Updates
            </TabsTrigger>
            <TabsTrigger 
              value="fuel" 
              className="hover:bg-sky-50 hover:text-sky-950 transition-colors text-sky-950"
            >
              Fuel Requests
            </TabsTrigger>
            <TabsTrigger 
              value="maintenance" 
              className="hover:bg-sky-50 hover:text-sky-950 transition-colors text-sky-950"
            >
              Maintenance
            </TabsTrigger>
          </TabsList>

          {/* Condition Updates Tab */}
          <TabsContent value="condition" className="space-y-6 text-sky-950">
            <Card>
              <CardHeader>
                <CardTitle>Vehicle Condition Updates</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleConditionSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="vehicleId">Vehicle ID</Label>
                      <Input
                        id="vehicleId"
                        value={newConditionUpdate.vehicleId}
                        onChange={(e) =>
                          setNewConditionUpdate({
                            ...newConditionUpdate,
                            vehicleId: e.target.value,
                          })
                        }
                        className='text-sky-950 bg-transparent'
                        placeholder="Enter vehicle ID"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status">Condition Status</Label>
                      <select
                        id="status"
                        value={newConditionUpdate.status}
                        onChange={(e) =>
                          setNewConditionUpdate({
                            ...newConditionUpdate,
                            status: e.target.value as 'Good' | 'Fair' | 'Poor',
                          })
                        }
                        className="flex h-10 w-full rounded-md border border-input px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-sky-950"
                        required
                      >
                        <option value="Good">Good</option>
                        <option value="Fair">Fair</option>
                        <option value="Poor">Poor</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      value={newConditionUpdate.notes}
                      onChange={(e) =>
                        setNewConditionUpdate({
                          ...newConditionUpdate,
                          notes: e.target.value,
                        })
                      }
                      className="min-h-[80px] bg-transparent border-sky-200 focus-visible:ring-sky-500"
                      placeholder="Add any additional notes about the vehicle's condition..."
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="file">Upload Images (Optional)</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="file"
                        type="file"
                        accept="image/*"
                        className="border-sky-200 bg-transparent focus-visible:ring-sky-500 focus-visible:ring-0"
                        onChange={(e) => {
                          // Handle file upload
                          if (e.target.files && e.target.files[0]) {
                            // TODO: Implement file upload logic
                            console.log('File selected:', e.target.files[0]);
                          }
                        }}
                      />
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                      Submit Update
                    </Button>
                  </div>
                </form>
                
                {/* Recent Updates Section */}
                <div className="mt-8">
                  <h2 className="text-lg text-sky-950 font-medium mb-4">Recent Updates</h2>
                  <ConditionUpdates />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Fuel Requests Tab Content */}
          <TabsContent value="fuel" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sky-950">Fuel Requests</CardTitle>
              </CardHeader>
              <CardContent>
                {/* New Fuel Request Form */}
                {showFuelRequestForm ? (
                  <form onSubmit={handleFuelRequestSubmit} className="space-y-4 mb-6 p-4 border rounded-lg bg-sky-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Vehicle ID Input */}
                      <div>
                        <Label htmlFor="fuel-vehicle-id" className="text-sky-950">
                          Vehicle ID <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="fuel-vehicle-id"
                          value={newFuelRequest.vehicleId}
                          onChange={(e) =>
                            setNewFuelRequest({ ...newFuelRequest, vehicleId: e.target.value })
                          }
                          className="bg-transparent text-sky-950 border-sky-200 focus-visible:ring-sky-500"
                          required
                          placeholder="Enter vehicle ID"
                        />
                      </div>
                      
                      {/* Amount Input */}
                      <div>
                        <Label htmlFor="fuel-amount" className="text-sky-950">
                          Amount (Liters) <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="fuel-amount"
                          type="number"
                          min="1"
                          step="0.1"
                          value={newFuelRequest.amount}
                          onChange={(e) =>
                            setNewFuelRequest({ ...newFuelRequest, amount: e.target.value })
                          }
                          className="bg-transparent text-sky-950 border-sky-200 focus-visible:ring-sky-500"
                          required
                          placeholder="e.g., 20.5"
                        />
                      </div>
                      
                      {/* Notes Textarea */}
                      <div className="md:col-span-2">
                        <Label htmlFor="fuel-notes" className="text-sky-950">
                          Notes (Optional)
                        </Label>
                        <Textarea
                          id="fuel-notes"
                          value={newFuelRequest.notes}
                          onChange={(e) =>
                            setNewFuelRequest({ ...newFuelRequest, notes: e.target.value })
                          }
                          className="min-h-[80px] bg-transparent text-sky-950 border-sky-200 focus-visible:ring-sky-500"
                          placeholder="Any additional information about this request"
                        />
                      </div>
                    </div>
                    
                    {/* Form Actions */}
                    <div className="flex justify-end space-x-3 pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowFuelRequestForm(false)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="submit" 
                        className="bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                        disabled={!newFuelRequest.vehicleId || !newFuelRequest.amount}
                      >
                        Submit Request
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="flex justify-end mb-6">
                    <Button 
                      className="bg-blue-600 text-blacks hover:bg-blue-700 transition-colors"
                      onClick={() => setShowFuelRequestForm(true)}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      New Fuel Request
                    </Button>
                  </div>
                )}
                
                {/* Fuel Requests List */}
                <div className="space-y-4 border border-">
                  <h3 className="text-lg font-medium text-sky-950">Recent Fuel Requests</h3>
                  
                  {fuelRequests.length > 0 ? (
                    fuelRequests.map((request) => (
                      <div key={request.id} className="border border-sky-950 rounded-lg p-4 bg-white">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <div>
                            <p className="font-medium">
                              {request.vehicle || `Vehicle ID: ${request.vehicleId}`}
                            </p>
                            <p className="text-sm text-gray-500">
                              {request.amount}L • {new Date(request.date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                              {request.notes && (
                                <span className="block mt-1 text-gray-600">
                                  {request.notes}
                                </span>
                              )}
                            </p>
                          </div>
                          <span 
                            className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                              request.status === 'Approved' 
                                ? 'bg-green-100 text-green-800' 
                                : request.status === 'Rejected'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-yellow-100 text-yellow-800'
                            }`}
                            aria-label={`Request status: ${request.status}`}
                          >
                            {request.status}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 border rounded-lg bg-sky-50">
                      <p className="text-gray-500">No fuel requests found</p>
                      <p className="text-sm text-gray-400 mt-1">
                        {showFuelRequestForm ? 'Fill out the form above to create your first request' : 'Click "New Fuel Request" to get started'}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Maintenance Tab Content */}
          <TabsContent value="maintenance" className="space-y-6 text-sky-950">
            <Card>
              <CardHeader>
                <CardTitle className="text-sky-950">Maintenance Requests</CardTitle>
                <CardDescription className="text-sky-900">
                  Submit and track maintenance requests for your vehicles
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* New Maintenance Request Form */}
                <form onSubmit={handleMaintenanceRequestSubmit} className="space-y-4 mb-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Vehicle ID Input */}
                    <div>
                      <Label htmlFor="maintenance-vehicle-id" className="text-sky-950">
                        Vehicle ID <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="maintenance-vehicle-id"
                        type="number"
                        min="1"
                        value={newMaintenanceRequest.vehicleId}
                        onChange={(e) =>
                          setNewMaintenanceRequest({ ...newMaintenanceRequest, vehicleId: e.target.value })
                        }
                        className="bg-transparent text-sky-950 border-sky-200 focus-visible:ring-sky-500"
                        required
                        placeholder="Enter vehicle ID"
                      />
                    </div>

                    {/* Priority Select */}
                    <div>
                      <Label htmlFor="maintenance-priority" className="text-sky-950">
                        Priority <span className="text-red-500">*</span>
                      </Label>
                      <select
                        id="maintenance-priority"
                        value={newMaintenanceRequest.priority}
                        onChange={(e) =>
                          setNewMaintenanceRequest({ 
                            ...newMaintenanceRequest, 
                            priority: e.target.value as 'low' | 'medium' | 'high' 
                          })
                        }
                        className="flex h-10 w-full rounded-md bg-transparent text-sky-950 border border-sky-200 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-sky-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        required
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>

                    {/* Issue Description */}
                    <div className="md:col-span-2">
                      <Label htmlFor="maintenance-issue" className="text-sky-950">
                        Issue Description <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        id="maintenance-issue"
                        value={newMaintenanceRequest.issue}
                        onChange={(e) =>
                          setNewMaintenanceRequest({ ...newMaintenanceRequest, issue: e.target.value })
                        }
                        className="min-h-[100px] bg-transparent text-sky-950 border-sky-200 focus-visible:ring-sky-500"
                        placeholder="Describe the issue in detail..."
                        required
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Submit Request
                    </Button>
                  </div>
                </form>

                {/* Maintenance Requests List */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-sky-950 mb-4">
                    Recent Maintenance Requests
                  </h3>

                  {maintenanceRequests.length > 0 ? (
                    <div className="overflow-hidden ring-1 ring-black ring-opacity-5 rounded-lg">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-sky-50">
                          <tr>
                            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-sky-950 sm:pl-6">
                              Vehicle
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-sky-950">
                              Issue
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-sky-950">
                              Priority
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-sky-950">
                              Status
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-sky-950">
                              Date
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                          {maintenanceRequests.map((request) => (
                            <tr key={request.id} className="hover:bg-sky-50">
                              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-sky-950 sm:pl-6">
                                {request.vehicle?.name || `Vehicle #${request.vehicleId}`}
                              </td>
                              <td className="px-3 py-4 text-sm text-sky-900 max-w-xs truncate">
                                {request.issue}
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  request.priority === 'high' 
                                    ? 'bg-red-100 text-red-800' 
                                    : request.priority === 'medium'
                                      ? 'bg-yellow-100 text-yellow-800'
                                      : 'bg-green-100 text-green-800'
                                }`}>
                                  {request.priority.charAt(0).toUpperCase() + request.priority.slice(1)}
                                </span>
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  request.status === 'completed'
                                    ? 'bg-green-100 text-green-800'
                                    : request.status === 'in-progress'
                                      ? 'bg-blue-100 text-blue-800'
                                      : request.status === 'rejected'
                                        ? 'bg-red-100 text-red-800'
                                        : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {request.status.split('-').map(word => 
                                    word.charAt(0).toUpperCase() + word.slice(1)
                                  ).join(' ')}
                                </span>
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-sky-950">
                                  {new Date(request.createdAt).toLocaleDateString()}
                                </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                      <Wrench className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No maintenance requests</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Submit a new request using the form above.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default OwnerDashboard;
