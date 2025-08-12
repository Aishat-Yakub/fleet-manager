'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, X, FileIcon, UploadCloud, Wrench } from 'lucide-react';

// UI Components
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

// Custom Components
import { ConditionUpdates } from '@/components/condition-updates';
import { FuelRequests } from './components/FuelRequests';
import { MaintenanceRequests } from './components/MaintenanceRequests';
import { InspectionFiles } from './components/InspectionFiles';

// Types
import { Vehicle, FuelRequest, MaintenanceRequest, InspectionFile } from './types';
import { fetchApi } from '@/lib/api';

// TODO: Replace with dynamic owner ID from authentication or URL parameters
const OWNER_ID = '1';

/**
 * OwnerDashboard Component
 * Main dashboard for vehicle owners to manage their fleet
 * Includes tabs for condition updates, fuel requests, maintenance, and inspections
 */
export default function OwnerDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('condition');
  const [newConditionUpdate, setNewConditionUpdate] = useState({
    vehicleId: '',
    status: 'Good' as 'Good' | 'Fair' | 'Poor',
    notes: '',
  });

  /**
   * Handles form submission for condition updates
   */
  const handleConditionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetchApi('/owners/' + ownerId + '/condition-updates', {
        method: 'POST',
        body: JSON.stringify(newConditionUpdate),
      });
      setNewConditionUpdate({ vehicleId: '', status: 'Good', notes: '' });
      // TODO: Show success toast
    } catch (error) {
      console.error('Error submitting condition update:', error);
      // TODO: Show error toast
    }
  };

  /**
   * Handles file upload for condition updates
   */
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // TODO: Implement file upload functionality
      console.log('Uploading file:', file.name);
    }
  };

  // TODO: Replace with dynamic owner ID from authentication or URL parameters
  // This should be retrieved from your authentication context or URL parameters
  const ownerId = '1';

  // State for maintenance requests
  const [maintenanceRequests, setMaintenanceRequests] = useState<Array<{
    id: number;
    vehicleId: number;
    issue: string;
    priority: 'low' | 'medium' | 'high';
    status: 'pending' | 'in-progress' | 'completed' | 'rejected';
    createdAt: string;
    updatedAt: string;
    vehicle?: {
      id: number;
      name: string;
      plateNumber: string;
    };
  }>>([]);
  
  const [newMaintenanceRequest, setNewMaintenanceRequest] = useState({
    vehicleId: '',
    issue: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
  });

  // State for inspection files
  const [inspectionFiles, setInspectionFiles] = useState<Array<{
    id: string;
    name: string;
    url: string;
    uploadedAt: string;
    size: number;
  }>>([]);
  const [isLoadingInspectionFiles, setIsLoadingInspectionFiles] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // State for fuel requests
  const [fuelRequests, setFuelRequests] = useState<Array<{
    id: number;
    date: string;
    status: string;
    amount: string;
    vehicle: string;
    vehicleId?: string;
    notes?: string;
  }>>([]);
  const [isLoadingFuelRequests, setIsLoadingFuelRequests] = useState(false);
  const [newFuelRequest, setNewFuelRequest] = useState({
    vehicleId: '',
    amount: '',
    notes: '',
  });
  const [showFuelRequestForm, setShowFuelRequestForm] = useState(false);

  /**
   * Fetches fuel requests for the current owner
   */
  const fetchFuelRequests = useCallback(async () => {
    try {
      setIsLoadingFuelRequests(true);
  const data = await fetchApi(`/owners/${ownerId}/fuel-requests`);
  setFuelRequests(data as FuelRequest[]);
    } catch (error) {
      console.error('Error fetching fuel requests:', error);
      // TODO: Show error toast to the user
    } finally {
      setIsLoadingFuelRequests(false);
    }
  }, [ownerId]);

  /**
   * Handles form submission for new fuel requests
   */
  const handleFuelRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await fetchApi(`/owners/${ownerId}/fuel-requests`, {
        method: 'POST',
        body: JSON.stringify({
          vehicleId: newFuelRequest.vehicleId,
          amount: newFuelRequest.amount,
          notes: newFuelRequest.notes,
        }),
      });
      // Refresh the fuel requests list
      await fetchFuelRequests();
      // Reset form and hide it
      setNewFuelRequest({ vehicleId: '', amount: '', notes: '' });
      setShowFuelRequestForm(false);
      // TODO: Show success toast
    } catch (error) {
      console.error('Error submitting fuel request:', error);
      // TODO: Show error toast
    }
  };

  /**
   * Fetches inspection files for the current owner
   */
  const fetchInspectionFiles = useCallback(async () => {
    try {
      setIsLoadingInspectionFiles(true);
  const data = await fetchApi(`/owners/${ownerId}/inspection-files`);
  setInspectionFiles(data as InspectionFile[]);
    } catch (error) {
      console.error('Error fetching inspection files:', error);
      // TODO: Show error toast to the user
    } finally {
      setIsLoadingInspectionFiles(false);
    }
  }, [ownerId]);

  /**
   * Handles inspection file selection for upload
   */
  const handleInspectionFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  /**
   * Handles inspection file upload submission
   */
  const handleInspectionFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      // TODO: Show error toast - no file selected
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      setIsUploading(true);
      setUploadProgress(0);
      const formData = new FormData();
      if (selectedFile) {
        formData.append('file', selectedFile);
      }
      await fetchApi(`/owners/${ownerId}/inspection-files`, {
        method: 'POST',
        body: formData,
      });
      // Refresh the files list
      await fetchInspectionFiles();
      // Reset form
      setSelectedFile(null);
      setUploadProgress(0);
      // TODO: Show success toast
    } catch (error) {
      console.error('Error uploading file:', error);
      // TODO: Show error toast
    } finally {
      setIsUploading(false);
    }
  };

  /**
   * Formats file size to human-readable format
   */
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  /**
   * Fetches maintenance requests for the current owner
   */
  const fetchMaintenanceRequests = useCallback(async () => {
    try {
  const data = await fetchApi(`/owners/${ownerId}/maintenance-requests`);
  setMaintenanceRequests(data as MaintenanceRequest[]);
    } catch (error) {
      console.error('Error fetching maintenance requests:', error);
      // TODO: Show error toast to the user
    }
  }, [ownerId]);

  /**
   * Handles submission of a new maintenance request
   */
  const handleMaintenanceRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await fetchApi(`/owners/${ownerId}/maintenance-requests`, {
        method: 'POST',
        body: JSON.stringify({
          ...newMaintenanceRequest,
          vehicleId: parseInt(newMaintenanceRequest.vehicleId, 10),
        }),
      });
      // Refresh the maintenance requests list
      await fetchMaintenanceRequests();
      // Reset form
      setNewMaintenanceRequest({
        vehicleId: '',
        issue: '',
        priority: 'medium',
      });
      // TODO: Show success toast
    } catch (error) {
      console.error('Error submitting maintenance request:', error);
      // TODO: Show error toast
    }
  };

  // Fetch data when tab changes
  useEffect(() => {
    if (activeTab === 'fuel') {
      fetchFuelRequests();
    } else if (activeTab === 'inspections') {
      fetchInspectionFiles();
    } else if (activeTab === 'maintenance') {
      fetchMaintenanceRequests();
    }
  }, [activeTab, fetchFuelRequests, fetchInspectionFiles, fetchMaintenanceRequests]);

  // Handle tab change
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
            onClick={() => router.back()}
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
            <TabsTrigger 
              value="inspections" 
              className="hover:bg-sky-50 hover:text-sky-950 transition-colors text-sky-950"
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
                        className="flex h-10 w-full rounded-md border border-input px-3background
                         py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-sky-950"
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
                      className="min-h-[80px] bg-transparent border-sky-200 focus-visible:ring-sky-500 focus-visible:ring-0"
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
                      Submit Ufocuspdate
                    </Button>
                  </div>
                </form>
                
                {/* Recent Updates Section */}
                <div className="mt-8">
                  <h2 className="text-lg text-sky-950 font-medium mb-4">Recent Updates</h2>
                  <ConditionUpdates ownerId={ownerId} />
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
                
                {isLoadingFuelRequests ? (
                  <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-950"></div>
                    <span className="ml-2">Loading fuel requests...</span>
                  </div>
                ) : fuelRequests.length > 0 ? (
                  fuelRequests.map((request) => (
                    <div key={request.id} className="border border-sky-950 rounded-lg p-4 bg-white">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div>
                          <p className="font-medium">
                            {request.vehicle || `Vehicle ID: ${request.vehicleId}`}
                          </p>slate
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
              <CardDescription className="text-sky-950">
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

        {/* Inspections Tab Content */}
        <TabsContent value="inspections" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sky-950">Vehicle Inspection Files</CardTitle>
              <CardDescription className="text-sky-900">
                Upload and manage your vehicle inspection documents
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* File Upload Form */}
              <form onSubmit={handleInspectionFileUpload} className="space-y-4 mb-8">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <UploadCloud className="h-12 w-12 text-gray-400" />
                    <div className="flex flex-col items-center">
                      <p className="text-sm text-sky-950">
                        <label 
                          htmlFor="inspection-file-upload" 
                          className="relative cursor-pointer font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                        >
                            <span>Upload a file</span>
                            <input 
                              id="inspection-file-upload" 
                              name="file-upload" 
                              type="file" 
                              className="sr-only" 
                              onChange={handleInspectionFileSelect}
                              accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                            />
                        </label>
                        <span className="pl-1">or drag and drop</span>
                      </p>
                      <p className="text-xs text-sky-900">
                        PDF, DOC, XLS, JPG, PNG up to 10MB
                      </p>
                    </div>
                  </div>

                  {selectedFile && (
                    <div className="mt-4 p-3 bg-sky-50 rounded-md">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <FileIcon className="h-5 w-5 text-sky-950" />
                          <span className="text-sm font-medium text-sky-950 truncate max-w-xs">
                            {selectedFile.name}
                          </span>
                          <span className="text-xs text-sky-900">
                            {formatFileSize(selectedFile.size)}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setSelectedFile(null)}
                          className="text-gray-400 hover:text-gray-500"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      
                      {isUploading && (
                        <div className="mt-2">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-in-out"
                              style={{ width: `${uploadProgress}%` }}
                            ></div>
                          </div>
                          <p className="mt-1 text-xs text-gray-500 text-right">
                            {uploadProgress}% uploaded
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={!selectedFile || isUploading}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {isUploading ? 'Uploading...' : 'Upload File'}
                  </Button>
                </div>
              </form>

              {/* Files List */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Inspection Files
                </h3>

                {isLoadingInspectionFiles ? (
                  <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-2">Loading files...</span>
                  </div>
                ) : inspectionFiles.length > 0 ? (
                  <div className="overflow-hidden  ring-1 ring-black ring-opacity-5 rounded-lg">
                    <table className="min-w-full divide-y divide-gray-300">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                            Name
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            Uploaded
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            Size
                          </th>
                          <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                            <span className="sr-only">Actions</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {inspectionFiles.map((file) => (
                          <tr key={file.id}>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                              <div className="flex items-center">
                                <FileIcon className="h-5 w-5 text-gray-400 mr-2" />
                                <span className="truncate max-w-xs">{file.name}</span>
                              </div>
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {new Date(file.uploadedAt).toLocaleDateString()}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {formatFileSize(file.size)}
                            </td>
                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                              <a 
                                href={file.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-900 mr-4"
                              >
                                View
                              </a>
                              <button className="text-blue-600 hover:text-blue-900">
                                Download
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                    <FileIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No inspection files</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Get started by uploading a new file.
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
}
