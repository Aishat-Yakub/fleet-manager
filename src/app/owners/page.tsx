'use client';

import { useState, useEffect, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, UploadCloud, File as FileIcon, X, Wrench, ArrowLeft } from 'lucide-react';
import { InspectionFiles } from './components/InspectionFiles';
import { ConditionUpdates } from '@/components/condition-updates';
import { FuelRequest, MaintenanceRequest } from './types';
import { ConditionUpdate } from './types';


const OwnerDashboard = () => {
  const [activeTab, setActiveTab] = useState('condition');
  const [fuelRequests, setFuelRequests] = useState<FuelRequest[]>([]);
  const [maintenanceRequests, setMaintenanceRequests] = useState<MaintenanceRequest[]>([]);
  const [showFuelRequestForm, setShowFuelRequestForm] = useState(false);
  const [newFuelRequest, setNewFuelRequest] = useState({
    vehicle_id: '',
    litres: '',
    reason: '',
  });
  const [newMaintenanceRequest, setNewMaintenanceRequest] = useState({
    vehicle_id: '',
    issue: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
  });
  const [conditionUpdates, setConditionUpdates] = useState<ConditionUpdate[]>([]);
  const [newConditionUpdate, setNewConditionUpdate] = useState({ vehicle_id: '', condition: 'Good', notes: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFuelLoading, setIsFuelLoading] = useState(false);
  const [fuelError, setFuelError] = useState<string | null>(null);
  const [isConditionLoading, setIsConditionLoading] = useState(false);
  const [conditionError, setConditionError] = useState<string | null>(null);

  // Replace with actual ownerId from auth/session if available
  const owner_id = 1;

  // Fetch maintenance requests from API/Supabase
  const fetchMaintenanceRequests = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/owners?ownerId=${owner_id}`);
      if (!response.ok) throw new Error('Failed to fetch maintenance requests');
      const data = await response.json();
      setMaintenanceRequests(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [owner_id]);

  // Fetch fuel requests
  const fetchFuelRequests = useCallback(async () => {
    setIsFuelLoading(true);
    setFuelError(null);
    try {
      const response = await fetch(`/api/owners?ownerId=${owner_id}&type=fuel`);
      if (!response.ok) throw new Error('Failed to fetch fuel requests');
      const data = await response.json();
      setFuelRequests(Array.isArray(data) ? data : []);
    } catch (err) {
      setFuelError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsFuelLoading(false);
    }
  }, [owner_id]);

  // Fetch condition updates
  const fetchConditionUpdates = useCallback(async () => {
    setIsConditionLoading(true);
    setConditionError(null);
    try {
      const response = await fetch(`/api/owners?ownerId=${owner_id}&type=condition`);
      if (!response.ok) throw new Error('Failed to fetch condition updates');
      const data = await response.json();
      setConditionUpdates(Array.isArray(data) ? data : []);
    } catch (err) {
      setConditionError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsConditionLoading(false);
    }
  }, [owner_id]);

  useEffect(() => {
    fetchMaintenanceRequests();
    fetchFuelRequests();
    fetchConditionUpdates();
  }, [fetchMaintenanceRequests, fetchFuelRequests, fetchConditionUpdates]);

  const handleFuelRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsFuelLoading(true);
    setFuelError(null);
    try {
      const response = await fetch('/api/owners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vehicle_id: Number(newFuelRequest.vehicle_id),
          owner_id: owner_id,
          litres: Number(newFuelRequest.litres),
          reason: newFuelRequest.reason,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit fuel request');
      }
      await fetchFuelRequests();
      setNewFuelRequest({ vehicle_id: '', litres: '', reason: '' });
    } catch (err) {
      setFuelError(err instanceof Error ? err.message : 'Failed to submit fuel request');
    } finally {
      setIsFuelLoading(false);
    }
  };

  const handleMaintenanceRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      // Import the service dynamically to avoid SSR issues
      const { submitMaintenanceRequest } = await import('@/services/ownerService');
      const requestData = {
        vehicleId: Number(newMaintenanceRequest.vehicle_id),
        ownerId: owner_id,
        issue: newMaintenanceRequest.issue,
        priority: newMaintenanceRequest.priority,
      };
      await submitMaintenanceRequest(requestData);
      // Refresh list from API
      await fetchMaintenanceRequests();
      setNewMaintenanceRequest({
        vehicle_id: '',
        issue: '',
        priority: 'medium',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit request');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConditionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsConditionLoading(true);
    setConditionError(null);
    try {
      const response = await fetch('/api/owners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vehicle_id: Number(newConditionUpdate.vehicle_id),
          owner_id: owner_id,
          condition: newConditionUpdate.condition,
          notes: newConditionUpdate.notes,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit condition update');
      }
      await fetchConditionUpdates();
      setNewConditionUpdate({ vehicle_id: '', condition: 'Good', notes: '' });
    } catch (err) {
      setConditionError(err instanceof Error ? err.message : 'Failed to submit condition update');
    } finally {
      setIsConditionLoading(false);
    }
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
            className="border border-sky-950 font-bold rounded-lg grid w-full grid-cols-2 sm:grid-cols-4 gap-0 mb-8 p-1 hover:text-sky-950"
            aria-label="Vehicle management sections"
          >
            <TabsTrigger 
              value="condition" 
              className={
                `transition-colors text-sky-950 hover:bg-sky-50 hover:text-sky-950 ${activeTab === 'condition' ? 'bg-blue-600 text-white' : ''}`
              }
            >
              Condition Updates
            </TabsTrigger>
            <TabsTrigger 
              value="fuel" 
              className={
                `transition-colors text-sky-950 hover:bg-sky-50 hover:text-sky-950 ${activeTab === 'fuel' ? 'bg-blue-600 text-white' : ''}`
              }
            >
              Fuel Requests
            </TabsTrigger>
            <TabsTrigger 
              value="maintenance" 
              className={
                `transition-colors text-sky-950 hover:bg-sky-50 hover:text-sky-950 ${activeTab === 'maintenance' ? 'bg-blue-600 text-white' : ''}`
              }
            >
              Maintenance
            </TabsTrigger>
            <TabsTrigger 
              value="inspections" 
              className={
                `transition-colors text-sky-950 hover:bg-sky-50 hover:text-sky-950 ${activeTab === 'inspections' ? 'bg-blue-600 text-white' : ''}`
              }
            >
              Inspections
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
                      <Label htmlFor="condition-vehicle-id">Vehicle ID</Label>
                      <Input
                        id="condition-vehicle-id"
                        type="number"
                        min="1"
                        value={newConditionUpdate.vehicle_id}
                        onChange={(e) => setNewConditionUpdate({ ...newConditionUpdate, vehicle_id: e.target.value })}
                        className='text-sky-950 bg-transparent'
                        placeholder="Enter vehicle ID"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="condition-status">Condition Status</Label>
                      <select
                        id="condition-status"
                        value={newConditionUpdate.condition}
                        onChange={(e) => setNewConditionUpdate({ ...newConditionUpdate, condition: e.target.value })}
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
                    <Label htmlFor="condition-notes">Notes</Label>
                    <Textarea
                      id="condition-notes"
                      value={newConditionUpdate.notes}
                      onChange={(e) => setNewConditionUpdate({ ...newConditionUpdate, notes: e.target.value })}
                      className="min-h-[80px] bg-transparent border-sky-200 focus-visible:ring-sky-500"
                      placeholder="Add any additional notes about the vehicle's condition..."
                      rows={3}
                    />
                  </div>
                  <div className="pt-4">
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white" disabled={isConditionLoading}>
                      Submit Update
                    </Button>
                  </div>
                  {conditionError && <div className="text-red-500 mt-2">{conditionError}</div>}
                </form>
                
                {/* Recent Updates Section */}
                <div className="mt-8">
                  <h2 className="text-lg text-sky-950 font-medium mb-4">Recent Updates</h2>
                  {isConditionLoading ? (
                    <div className="text-center py-8">Loading...</div>
                  ) : conditionUpdates.length > 0 ? (
                    conditionUpdates.map((update) => (
                      <div key={update.id} className="border border-sky-950 rounded-lg p-4 bg-white mb-2">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <div>
                            <p className="font-medium">Vehicle #{update.vehicle_id}</p>
                            <p className="text-sm text-gray-500">
                              Condition: {update.condition} • {new Date(update.created_at).toLocaleDateString('en-US', {
                                year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                              })}
                              {update.notes && (
                                <span className="block mt-1 text-gray-600">{update.notes}</span>
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 border rounded-lg bg-sky-50">
                      <p className="text-gray-500">No condition updates found</p>
                      <p className="text-sm text-gray-400 mt-1">Fill out the form above to create your first update</p>
                    </div>
                  )}
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
                <form onSubmit={handleFuelRequestSubmit} className="space-y-4 mb-6 p-4 border rounded-lg bg-sky-50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fuel-vehicle-id" className="text-sky-950">
                        Vehicle ID <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="fuel-vehicle-id"
                        type="number"
                        min="1"
                        value={newFuelRequest.vehicle_id}
                        onChange={(e) => setNewFuelRequest({ ...newFuelRequest, vehicle_id: e.target.value })}
                        className="bg-transparent text-sky-950 border-sky-200 focus-visible:ring-sky-500"
                        required
                        placeholder="Enter vehicle ID"
                      />
                    </div>
                    <div>
                      <Label htmlFor="fuel-litres" className="text-sky-950">
                        Litres <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="fuel-litres"
                        type="number"
                        min="1"
                        value={newFuelRequest.litres}
                        onChange={(e) => setNewFuelRequest({ ...newFuelRequest, litres: e.target.value })}
                        className="bg-transparent text-sky-950 border-sky-200 focus-visible:ring-sky-500"
                        required
                        placeholder="Enter litres"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="fuel-reason" className="text-sky-950">
                        Reason <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        id="fuel-reason"
                        value={newFuelRequest.reason}
                        onChange={(e) => setNewFuelRequest({ ...newFuelRequest, reason: e.target.value })}
                        className="min-h-[80px] bg-transparent text-sky-950 border-sky-200 focus-visible:ring-sky-500"
                        required
                        placeholder="Reason for fuel request"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-3 pt-2">
                    <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700 transition-colors" disabled={isFuelLoading}>
                      Submit Request
                    </Button>
                  </div>
                  {fuelError && <div className="text-red-500 mt-2">{fuelError}</div>}
                </form>

                {/* Fuel Requests List */}
                <div className="space-y-4 border border-">
                  <h3 className="text-lg font-medium text-sky-950">Recent Fuel Requests</h3>
                  {isFuelLoading ? (
                    <div className="text-center py-8">Loading...</div>
                  ) : fuelRequests.length > 0 ? (
                    fuelRequests.map((request) => (
                      <div key={request.id} className="border border-sky-950 rounded-lg p-4 bg-white">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <div>
                            <p className="font-medium">Vehicle #{request.vehicle_id}</p>
                            <p className="text-sm text-gray-500">
                              {request.litres}L • {new Date(request.created_at).toLocaleDateString('en-US', {
                                year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                              })}
                              {request.reason && (
                                <span className="block mt-1 text-gray-600">{request.reason}</span>
                              )}
                            </p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                            request.status === 'approved'
                              ? 'bg-green-100 text-green-800'
                              : request.status === 'rejected'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                          }`} aria-label={`Request status: ${request.status}`}>
                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 border rounded-lg bg-sky-50">
                      <p className="text-gray-500">No fuel requests found</p>
                      <p className="text-sm text-gray-400 mt-1">Fill out the form above to create your first request</p>
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
                        value={newMaintenanceRequest.vehicle_id}
                        onChange={(e) =>
                          setNewMaintenanceRequest({ ...newMaintenanceRequest, vehicle_id: e.target.value })
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
                                {`Vehicle #${request.vehicle_id}`}
                              </td>
                              <td className="px-3 py-4 text-sm text-sky-900 max-w-xs truncate">
                                {request.issue}
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  request.priority.trim() === 'high' 
                                    ? 'bg-red-100 text-red-800' 
                                    : request.priority.trim() === 'medium'
                                      ? 'bg-yellow-100 text-yellow-800'
                                      : 'bg-green-100 text-green-800'
                                }`}>
                                  {request.priority.trim().charAt(0).toUpperCase() + request.priority.trim().slice(1)}
                                </span>
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  request.status === 'completed'
                                    ? 'bg-green-100 text-green-800'
                                    : request.status === 'approved'
                                      ? 'bg-blue-100 text-blue-800'
                                      : request.status === 'rejected'
                                        ? 'bg-red-100 text-red-800'
                                        : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                </span>
                              </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-sky-950">
                  {new Date(request.created_at).toLocaleDateString()}
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

          {/* Inspections Tab Content */}
          <TabsContent value="inspections" className="space-y-6 text-sky-950">
            <InspectionFiles ownerId={owner_id.toString()} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default OwnerDashboard;
