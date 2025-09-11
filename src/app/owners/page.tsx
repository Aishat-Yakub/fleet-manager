'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Search } from 'lucide-react';
import { FuelRequest, MaintenanceRequest } from './types';
import { ConditionUpdate } from '@/services/conditionService';
import { useFuelRequests } from './hooks/useFuelRequests';
import { getConditionUpdates, updateConditionStatus } from '@/services/conditionService';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Logo from '@/app/assets/logo/Logo.jpg'; 
import Image from 'next/image'
import { Wrench, ArrowLeft } from 'lucide-react';

const OwnerDashboard = () => {
  const [activeTab, setActiveTab] = useState('condition');
  // Initialize state at the top of the component
  const [ownerId] = useState<string>('1');
  
  // Use the useFuelRequests hook
  const { 
    fuelRequests, 
    isLoading: isFuelLoading, 
    error: fuelError,
    createFuelRequest,
    fetchFuelRequests 
  } = useFuelRequests(ownerId);
  
  const [maintenanceRequests, setMaintenanceRequests] = useState<MaintenanceRequest[]>([]);
  const [isSubmittingFuel, setIsSubmittingFuel] = useState(false);
  const [newFuelRequest, setNewFuelRequest] = useState({
    vehicle_id: '',
    litres: '',
    reason: '',
    bank: '',
    account: '',
    name: ''
  });
  const [newMaintenanceRequest, setNewMaintenanceRequest] = useState({
    vehicle_id: '',
    issue: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    name: ''
  });
  const [maintenanceFileUrl, setMaintenanceFileUrl] = useState<string | null>(null);
  const [uploadingMaintenanceFile, setUploadingMaintenanceFile] = useState(false);
  const maintenanceFileInputRef = useRef<HTMLInputElement | null>(null);
  const [conditionUpdates, setConditionUpdates] = useState<ConditionUpdate[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [fuelSearchTerm, setFuelSearchTerm] = useState('');
  const [maintenanceSearchTerm, setMaintenanceSearchTerm] = useState('');
  const [newConditionUpdate, setNewConditionUpdate] = useState<{
    vehicle_id: string;
    conditon: 'Good' | 'Fair' | 'Poor';
    note: string;
    name: string;
  }>({
    vehicle_id: '',
    conditon: 'Good',
    note: '',
    name: ''
  });

  // Initialize file upload state
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // file upload logic
  const handleFileUpload = async (file: File) => {
    setUploading(true);
    setUploadError(null);
    setFileUrl(null);
  
    try {
      const supabase = createClientComponentClient();
      const fileExt = file.name.split('.').pop();
      
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `uploads/${fileName}`;
  
      // ⚡ Make sure bucket name matches your dashboard
      const { data, error } = await supabase.storage
        .from('upload') 
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
          contentType: file.type,
        });
  
      if (error) throw error;
  
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('upload') 
        .getPublicUrl(filePath);
  
      setFileUrl(publicUrl);
      return publicUrl;
    } catch (err) {
      console.error('Upload error:', err);
      const errorMessage = err instanceof Error ? err.message : 'File upload failed';
      setUploadError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setUploading(false);
    }
  };
  
  const [error, setError] = useState<string | null>(null);
  const [isConditionLoading, setIsConditionLoading] = useState(false);
  const [conditionError, setConditionError] = useState<string | null>(null);

  // ownerId is now managed by the state above

  // Fetch maintenance requests from API
  const fetchMaintenanceRequests = useCallback(async () => {
    setError(null);
    try {
      const response = await fetch('/api/owners?type=maintenance');
      if (!response.ok) {
        throw new Error('Failed to fetch maintenance requests');
      }
      const data = await response.json();
      setMaintenanceRequests(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  }, []);


  // Fetch vehicle conditions
  const fetchConditionUpdates = useCallback(async () => {
    setIsConditionLoading(true);
    setConditionError(null);
    try {
      const data = await getConditionUpdates();
      setConditionUpdates(data);
    } catch (err) {
      console.error('Error fetching vehicle conditions:', err);
      setConditionError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsConditionLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMaintenanceRequests();
    fetchFuelRequests();
    fetchConditionUpdates();
  }, [fetchMaintenanceRequests, fetchFuelRequests, fetchConditionUpdates]);

  const handleFuelRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!newFuelRequest.vehicle_id || !newFuelRequest.litres || !newFuelRequest.reason) {
      setError('Please fill in all required fields');
      return;
    }

    setIsSubmittingFuel(true);
    setError(null);

    try {
      const result = await createFuelRequest({
        ...newFuelRequest,
        vehicle_id: newFuelRequest.vehicle_id,
        litres: newFuelRequest.litres,
        reason: newFuelRequest.reason,
        bank: newFuelRequest.bank,
        account: newFuelRequest.account,
        Name: newFuelRequest.name,
        owner_id: ownerId,
      });

      if (result.success) {
        // Reset form and hide it
        setNewFuelRequest({ 
          vehicle_id: '', 
          litres: '', 
          reason: '', 
          bank: '',
          account: '',
          name: ''
        });
        
        // Refresh the fuel requests list
        await fetchFuelRequests();
      } else {
        throw new Error(result.error || 'Failed to create fuel request');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error submitting fuel request:', err);
    } finally {
      setIsSubmittingFuel(false);
    }
  };

  // Handle maintenance request submission
  const handleMaintenanceRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { vehicle_id, issue, priority, name } = newMaintenanceRequest;
    
    if (!vehicle_id || !issue) {
      setError('Please fill in all required fields');
      return;
    }

    setError(null);
    
    try {
      const { createMaintenanceRequest } = await import('@/services/maintenanceService');
      
      // Include file URL in the request if a file was uploaded
      const requestData = {
        vehicle_id: vehicle_id,
        issue: issue,
        priority: priority || 'medium' as const,
        name: name || null,
        attachment_url: maintenanceFileUrl || null
      };
      
      await createMaintenanceRequest(requestData);
      
      // Refresh the maintenance requests and reset the form
      await fetchMaintenanceRequests();
      setNewMaintenanceRequest({
        vehicle_id: '',
        issue: '',
        priority: 'medium',
        name: ''
      });
      setMaintenanceFileUrl(null);
      if (maintenanceFileInputRef.current) maintenanceFileInputRef.current.value = '';
      
      // Show success message
      setError('Maintenance request submitted successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error submitting maintenance request:', err);
    } finally {
  // setIsLoading(false); // Removed unused
    }
  };

  const handleConditionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!newConditionUpdate.vehicle_id || !newConditionUpdate.conditon || !newConditionUpdate.name) {
      setError('Please fill in all required fields');
      return;
    }

    setIsConditionLoading(true);
    setConditionError(null);

    try {
      const { submitConditionUpdate } = await import('@/services/conditionService');
      await submitConditionUpdate(newConditionUpdate);
      
      // Add the new condition update to the list
      setConditionUpdates(prev => [
        {
          id: Date.now(), // Temporary ID
          name: newConditionUpdate.name || 'Owner',
          vehicle_id: newConditionUpdate.vehicle_id,
          conditon: newConditionUpdate.conditon,
          status: 'pending',
          created_at: new Date().toISOString(),
          note: newConditionUpdate.note
        },
        ...prev
      ]);

      // Reset form
      setNewConditionUpdate({
        vehicle_id: '',
        conditon: 'Good',
        note: '',
        name: ''
      });
      
    } catch (err) {
      console.error('Error submitting condition update:', err);
      setConditionError(err instanceof Error ? err.message : 'Failed to submit condition update');
    } finally {
      setIsConditionLoading(false);
    }
  };


  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <div className="min-h-screen bg-sky-50 flex flex-col items-center pt-4 sm:pt-6 md:pt-8 px-2 sm:px-4 md:px-6">
      <div className="w-full max-w-7xl p-2 sm:p-4 md:p-6 lg:p-8 rounded-lg border border-gray-100">
          <div className="flex items-center h-16 flex-shrink-0 px-2 sm:px-6 border-b border-gray-200">
            <h1 className="text-lg sm:text-2xl flex flex-col sm:flex-row items-center gap-2 font-bold text-gray-900">
              <div className="flex items-center w-full sm:w-auto justify-between sm:justify-start">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-sky-600 hover:bg-sky-100 p-1 sm:p-2 -ml-2"
                >
                  <ArrowLeft className="h-4 w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Back</span>
                </Button>
                <Image
                  src={Logo}
                  alt="Fleet Manager Logo"
                  width={80}
                  height={80}
                  className='h-12 w-12 sm:h-16 sm:w-16 rounded-full object-cover'
                />
              </div>
              <span className="text-center sm:text-left">Vehicle Management</span>
            </h1>     
          </div>

        <Tabs 
          value={activeTab} 
          onValueChange={handleTabChange} 
          className="w-full pt-2 sm:pt-4"
          defaultValue="condition"
        >
          <TabsList 
            className="w-full flex flex-wrap gap-1 p-1 bg-sky-50 rounded-lg border border-sky-200"
            aria-label="Vehicle management sections"
          >
            <TabsTrigger 
              value="condition" 
              className={`
                flex-1 min-w-[120px] sm:min-w-[140px] md:min-w-[160px] py-2 px-1 sm:px-2 md:px-4
                text-xs xs:text-sm sm:text-base font-medium rounded-md transition-all duration-200
                hover:bg-sky-100 hover:text-sky-900
                ${activeTab === 'condition' 
                  ? 'bg-blue-600 text-white hover:bg-blue-700 hover:text-white' 
                  : 'text-sky-700'}
              `}
            >
              <span className="truncate">Condition Updates</span>
            </TabsTrigger>
            <TabsTrigger 
              value="fuel" 
              className={`
                flex-1 min-w-[120px] sm:min-w-[140px] md:min-w-[160px] py-2 px-1 sm:px-2 md:px-4
                text-xs xs:text-sm sm:text-base font-medium rounded-md transition-all duration-200
                hover:bg-sky-100 hover:text-sky-900
                ${activeTab === 'fuel' 
                  ? 'bg-blue-600 text-white hover:bg-blue-700 hover:text-white' 
                  : 'text-sky-700'}
              `}
            >
              <span className="truncate">Fuel Requests</span>
            </TabsTrigger>
            <TabsTrigger 
              value="maintenance" 
              className={`
                flex-1 min-w-[120px] sm:min-w-[140px] md:min-w-[160px] py-2 px-1 sm:px-2 md:px-4
                text-xs xs:text-sm sm:text-base font-medium rounded-md transition-all duration-200
                hover:bg-sky-100 hover:text-sky-900
                ${activeTab === 'maintenance' 
                  ? 'bg-blue-600 text-white hover:bg-blue-700 hover:text-white' 
                  : 'text-sky-700'}
              `}
            >
              <span className="truncate">Maintenance</span>
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
                      <Label htmlFor="name">Name <span className="text-red-500">*</span></Label>
                      <Input
                        id="name"
                        value={newConditionUpdate.name}
                        onChange={(e) => setNewConditionUpdate({...newConditionUpdate, name: e.target.value})}
                        placeholder="Your full name"
                        required
                        className="bg-transparent border-sky-200 focus-visible:ring-sky-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="vehicle_id">Vehicle ID <span className="text-red-500">*</span></Label>
                      <Input
                        id="vehicle_id"
                        value={newConditionUpdate.vehicle_id}
                        onChange={(e) => setNewConditionUpdate({...newConditionUpdate, vehicle_id: e.target.value})}
                        placeholder="e.g., LASU28381"
                        required
                        className="bg-transparent border-sky-200 focus-visible:ring-sky-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="conditon">Condition <span className="text-red-500">*</span></Label>
                      <select
                        id="conditon"
                        value={newConditionUpdate.conditon}
                        onChange={(e) => setNewConditionUpdate({...newConditionUpdate, conditon: e.target.value as 'Good' | 'Fair' | 'Poor'})}
                        className="w-full p-2 border border-sky-200 rounded-md bg-transparent focus-visible:ring-sky-500 focus-visible:ring-2"
                        required
                      >
                        <option value="Good">Good</option>
                        <option value="Fair">Fair</option>
                        <option value="Poor">Poor</option>
                      </select>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="note">Note</Label>
                      <Textarea
                        id="note"
                        value={newConditionUpdate.note}
                        onChange={(e) => setNewConditionUpdate({...newConditionUpdate, note: e.target.value})}
                        className="min-h-[80px] bg-transparent border-sky-200 focus-visible:ring-sky-500"
                        placeholder="Add any additional notes about the vehicle's condition..."
                      />
                    </div>
                  </div>

                  {/* Standalone File Upload Section */}
                  <div className="my-8">
                    <Card>
                      <CardHeader>
                        <CardTitle>Upload </CardTitle>
                        <CardDescription>Upload images or PDFs.</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <input
                          type="file"
                          accept="image/*,application/pdf"
                          ref={fileInputRef}
                          onChange={async (e) => {
                            if (e.target.files && e.target.files[0]) {
                              await handleFileUpload(e.target.files[0]);
                            }
                          }}
                          disabled={uploading}
                          className="block w-full text-sm text-sky-950 border border-sky-200 rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky-500"
                        />
                        {uploading && <div className="text-blue-600 text-xs mt-2">Uploading...</div>}
                        {uploadError && <div className="text-red-600 text-xs mt-2">{uploadError}</div>}
                        {fileUrl && (
                          <div className="text-green-700 text-xs mt-2 break-all">File uploaded: <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="underline">View file</a></div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                  <div className="pt-4">
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white" disabled={isConditionLoading}>
                      Submit Update
                    </Button>
                  </div>
                  {conditionError && <div className="text-red-700 mt-2">{conditionError}</div>}
                </form>
                
                {/* Recent Updates Section */}
                <div className="border-t border-gray-200 pt-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                    <h3 className="text-lg font-medium text-sky-950">
                      Recent Condition Updates
                    </h3>
                    <div className="relative w-full sm:w-64">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sky-950 h-4 w-4" />
                      <Input
                        type="text"
                        placeholder="Search by name, vehicle ID, status, or condition..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-transparent text-sky-950 placeholder:text-sky-950/40 border-sky-200 focus-visible:ring-sky-500"
                      />
                    </div>
                  </div>
                  {isConditionLoading ? (
                    <div className="text-center py-4 text-sky-950">Loading condition updates...</div>
                  ) : conditionUpdates.length > 0 ? (
                    <div className="overflow-x-auto">
                    <div className="inline-block min-w-full align-middle">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-sky-50">
                          <tr>
                            <th scope="col" className="py-3 pl-4 pr-3 text-left text-xs sm:text-sm font-semibold text-sky-950">
                              Vehicle ID
                            </th>
                            <th scope="col" className="px-3 py-3 text-left text-xs sm:text-sm font-semibold text-sky-950">
                              Name
                            </th>
                            <th scope="col" className="px-3 py-3 text-left text-xs sm:text-sm font-semibold text-sky-950">
                              Condition
                            </th>
                            <th scope="col" className="px-3 py-3 text-left text-xs sm:text-sm font-semibold text-sky-950 hidden sm:table-cell">
                              Note
                            </th>
                            <th scope="col" className="px-3 py-3 text-left text-xs sm:text-sm font-semibold text-sky-950">
                              Status
                            </th>
                            <th scope="col" className="px-3 py-3 text-left text-xs sm:text-sm font-semibold text-sky-950 hidden md:table-cell">
                              Date
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-transparent">
                          {conditionUpdates
                            .filter(update => {
                              if (!searchTerm) return true;
                              const searchLower = searchTerm.toLowerCase();
                              return (
                                update.name.toLowerCase().includes(searchLower) ||
                                update.vehicle_id.toLowerCase().includes(searchLower) ||
                                update.status.toLowerCase().includes(searchLower) ||
                                update.conditon.toLowerCase().includes(searchLower)
                              );
                            })
                            .map((update) => (
                            <tr key={update.id} className="hover:bg-sky-50">
                              <td className="py-3 pl-4 pr-3 text-sm font-medium text-sky-950">
                                <div className="flex flex-col sm:block">
                                  <span className="sm:hidden text-xs text-gray-500 mb-1">Vehicle ID:</span>
                                  {update.vehicle_id}
                                </div>
                                <div className="sm:hidden text-xs text-gray-600 mt-1">
                                  Condition: {update.conditon}
                                </div>
                              </td>
                              <td className="px-3 py-3 text-sm text-sky-950">
                                <div className="flex flex-col sm:block">
                                  <span className="sm:hidden text-xs text-gray-500 mb-1">Name:</span>
                                  {update.name || '—'}
                                </div>
                              </td>
                              <td className="px-3 py-3 text-sm text-sky-950">
                                <div className="flex flex-col sm:block">
                                  <span className="sm:hidden text-xs text-gray-500 mb-1">Condition:</span>
                                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                    update.conditon === 'Good'
                                      ? 'bg-green-100 text-green-800'
                                      : update.conditon === 'Fair'
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : 'bg-red-100 text-red-800'
                                  }`}>
                                    {update.conditon}
                                  </span>
                                </div>
                              </td>
                              <td className="hidden sm:table-cell px-3 py-3 text-sm text-sky-900 max-w-xs">
                                <div className="line-clamp-2">
                                  {update.note || '—'}
                                </div>
                              </td>
                              <td className="whitespace-nowrap px-3 py-3 text-sm">
                                <div className="flex flex-col sm:block">
                                  <span className="sm:hidden text-xs text-gray-500 mb-1">Status:</span>
                                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                    update.status === 'approved'
                                      ? 'bg-green-100 text-green-800'
                                      : update.status === 'rejected'
                                        ? 'bg-red-100 text-red-800'
                                        : 'bg-yellow-100 text-yellow-800'
                                  }`}>
                                    {update.status ? update.status.charAt(0).toUpperCase() + update.status.slice(1) : ''}
                                  </span>
                                </div>
                              </td>
                              <td className="whitespace-nowrap px-3 py-3 text-xs sm:text-sm text-sky-950 hidden md:table-cell">
                                {update.created_at ? new Date(update.created_at.replace(' ', 'T')).toLocaleDateString(undefined, {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                }) : "—"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
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
                <form onSubmit={handleFuelRequestSubmit} className="space-y-3 sm:space-y-4 mb-4 sm:mb-6 p-3 sm:p-4 border border-gray-200 rounded-lg bg-sky-50">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <Label htmlFor="fuel-vehicle-id" className="text-sky-950">
                        Vehicle ID <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="fuel-vehicle-id"
                        type="text"
                        value={newFuelRequest.vehicle_id}
                        onChange={(e) => setNewFuelRequest({ ...newFuelRequest, vehicle_id: e.target.value })}
                        className="w-full bg-transparent border-sky-200 focus-visible:ring-sky-500 placeholder:text-sky-950/40 text-sky-950"
                        placeholder="Enter vehicle ID"
                        required
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
                        className="w-full bg-transparent border-sky-200 focus-visible:ring-sky-500 placeholder:text-sky-950/40 text-sky-950"
                        placeholder="Enter litres"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="fuel-reason" className="text-sky-950">
                        Reason <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="fuel-reason"
                        value={newFuelRequest.reason}
                        onChange={(e) => setNewFuelRequest({ ...newFuelRequest, reason: e.target.value })}
                        className="w-full bg-transparent border-sky-200 focus-visible:ring-sky-500 placeholder:text-sky-950/40 text-sky-950"
                        placeholder="Reason for fuel request"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="fuel-name" className="text-sky-950">
                        Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="fuel-name"
                        type="text"
                        value={newFuelRequest.name}
                        onChange={(e) => setNewFuelRequest({ ...newFuelRequest, name: e.target.value })}
                        className="w-full bg-transparent border-sky-200 focus-visible:ring-sky-500 placeholder:text-sky-950/40 text-sky-950"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fuel-bank" className="text-sky-950">
                        Bank Name
                      </Label>
                      <Input
                        id="fuel-bank"
                        type="text"
                        value={newFuelRequest.bank}
                        onChange={(e) => setNewFuelRequest({ ...newFuelRequest, bank: e.target.value })}
                        className="w-full bg-transparent border-sky-200 focus-visible:ring-sky-500 placeholder:text-sky-950/40 text-sky-950"
                        placeholder="e.g., GTBank"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fuel-account" className="text-sky-950">
                        Account Number
                      </Label>
                      <Input
                        id="fuel-account"
                        type="text"
                        inputMode="numeric"
                        value={newFuelRequest.account}
                        onChange={(e) => setNewFuelRequest({ ...newFuelRequest, account: e.target.value })}
                        className="w-full bg-transparent border-sky-200 focus-visible:ring-sky-500 placeholder:text-sky-950/40 text-sky-950"
                        placeholder="Account number"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-4 mt-2">
                    <Button 
                      type="submit" 
                      disabled={isSubmittingFuel}
                      className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors"
                    >
                      {isSubmittingFuel ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Submitting...
                        </span>
                      ) : 'Submit Request'}
                    </Button>
                  </div>
                  {fuelError && <div className="text-red-500 mt-2">{fuelError}</div>}
                </form>

                {/* Fuel Requests List */}
                <div className="border-t border-gray-200 pt-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                    <h3 className="text-lg font-medium text-sky-950">
                      Recent Fuel Requests
                    </h3>
                    <div className="relative w-full sm:w-64">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sky-950 h-4 w-4" />
                      <Input
                        type="text"
                        placeholder="Search by name, vehicle ID, status, or reason..."
                        value={fuelSearchTerm}
                        onChange={(e) => setFuelSearchTerm(e.target.value)}
                        className="pl-10 bg-transparent text-sky-950 placeholder:text-sky-950/40 border-sky-200 focus-visible:ring-sky-500"
                      />
                    </div>
                  </div>
                  {error && (
                    <div className="p-3 text-sm text-red-700 bg-red-100 rounded-md mb-4">
                      {error}
                    </div>
                  )}
                  {isFuelLoading ? (
                    <div className="text-center py-4 text-sky-950">Loading fuel requests...</div>
                  ) : fuelRequests.length > 0 ? (
                    <div className="overflow-x-auto">
                    <div className="inline-block min-w-full align-middle">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-sky-50">
                          <tr>
                            <th scope="col" className="py-3 pl-4 pr-3 text-left text-xs sm:text-sm font-semibold text-sky-950">
                              Vehicle ID
                            </th>
                            <th scope="col" className="px-3 py-3 text-left text-xs sm:text-sm font-semibold text-sky-950">
                              Name
                            </th>
                            <th scope="col" className="px-3 py-3 text-left text-xs sm:text-sm font-semibold text-sky-950">
                              Litres
                            </th>
                            <th scope="col" className="px-3 py-3 text-left text-xs sm:text-sm font-semibold text-sky-950 hidden sm:table-cell">
                              Reason
                            </th>
                            <th scope="col" className="px-3 py-3 text-left text-xs sm:text-sm font-semibold text-sky-950">
                              Status
                            </th>
                            <th scope="col" className="px-3 py-3 text-left text-xs sm:text-sm font-semibold text-sky-950 hidden md:table-cell">
                              Date
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-transparent">
                          {fuelRequests
                            .filter(request => {
                              if (!fuelSearchTerm) return true;
                              const searchLower = fuelSearchTerm.toLowerCase();
                              return (
                                (request.Name && request.Name.toLowerCase().includes(searchLower)) ||
                                (request.vehicle_id && request.vehicle_id.toLowerCase().includes(searchLower)) ||
                                (request.status && request.status.toLowerCase().includes(searchLower)) ||
                                (request.reason && request.reason.toLowerCase().includes(searchLower))
                              );
                            })
                            .map((request: FuelRequest) => (
                            <tr key={request.id} className="hover:bg-sky-50">
                              <td className="py-3 pl-4 pr-3 text-sm font-medium text-sky-950">
                                <div className="flex flex-col sm:block">
                                  <span className="sm:hidden text-xs text-gray-500 mb-1">Vehicle ID:</span>
                                  {request.vehicle_id}
                                </div>
                                <div className="sm:hidden text-xs text-gray-600 mt-1">
                                  {request.litres}L
                                </div>
                              </td>
                              <td className="px-3 py-3 text-sm text-sky-950">
                                <div className="flex flex-col sm:block">
                                  <span className="sm:hidden text-xs text-gray-500 mb-1">Name:</span>
                                  {request.Name || '—'}
                                </div>
                              </td>
                              <td className="px-3 py-3 text-sm text-sky-950">
                                <div className="flex flex-col sm:block">
                                  <span className="sm:hidden text-xs text-gray-500 mb-1">Litres:</span>
                                  {request.litres}L
                                </div>
                              </td>
                              <td className="hidden sm:table-cell px-3 py-3 text-sm text-sky-900 max-w-xs">
                                <div className="line-clamp-2">
                                  {request.reason || '—'}
                                </div>
                              </td>
                              <td className="whitespace-nowrap px-3 py-3 text-sm">
                                <div className="flex flex-col sm:block">
                                  <span className="sm:hidden text-xs text-gray-500 mb-1">Status:</span>
                                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                    request.status === 'approved'
                                      ? 'bg-green-100 text-green-800'
                                      : request.status === 'rejected'
                                        ? 'bg-red-100 text-red-800'
                                        : 'bg-yellow-100 text-yellow-800'
                                  }`}>
                                    {request.status ? request.status.charAt(0).toUpperCase() + request.status.slice(1) : ''}
                                  </span>
                                </div>
                              </td>
                              <td className="whitespace-nowrap px-3 py-3 text-xs sm:text-sm text-sky-950 hidden md:table-cell">
                                {request.created_at ? new Date(request.created_at).toLocaleDateString(undefined, {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                  hour12: true
                                }) : "—"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
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
                <form onSubmit={handleMaintenanceRequestSubmit} className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    {/* Vehicle ID Input - First column */}
                    <div>
                      <Label htmlFor="maintenance-vehicle-id" className="text-sky-950">
                        Vehicle ID <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="maintenance-vehicle-id"
                        type="text"
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

                    {/* Name Input - Second column */}
                    <div>
                      <Label htmlFor="maintenance-name" className="text-sky-950">
                        Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="maintenance-name"
                        type="text"
                        value={newMaintenanceRequest.name}
                        onChange={(e) =>
                          setNewMaintenanceRequest({ ...newMaintenanceRequest, name: e.target.value })
                        }
                        className="bg-transparent text-sky-950 border-sky-200 focus-visible:ring-sky-500"
                        required
                        placeholder="Enter your full name"
                      />
                    </div>

                    {/* Priority Select - First column */}
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

                    {/* Issue Description - Full width */}
                    <div className="sm:col-span-2">
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

                  <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
                    <Button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Submit Request
                    </Button>
                  </div>
                </form>


                  {/* Standalone File Upload Section */}
                  <div className="my-8">
                    <Card>
                      <CardHeader>
                        <CardTitle>Upload</CardTitle>
                        <CardDescription>Upload images or PDFs</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <input
                          type="file"
                          accept="image/*,application/pdf"
                          ref={fileInputRef}
                          onChange={async (e) => {
                            if (e.target.files && e.target.files[0]) {
                              await handleFileUpload(e.target.files[0]);
                            }
                          }}
                          disabled={uploading}
                          className="block w-full text-sm text-sky-950 border border-sky-200 rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky-500"
                        />
                        {uploading && <div className="text-blue-600 text-xs mt-2">Uploading...</div>}
                        {uploadError && <div className="text-red-600 text-xs mt-2">{uploadError}</div>}
                        {fileUrl && (
                          <div className="text-green-700 text-xs mt-2 break-all">File uploaded: <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="underline">View file</a></div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                

                {/* Maintenance Requests List */}
                <div className="border-t border-gray-200 pt-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                    <h3 className="text-lg font-medium text-sky-950">
                      Recent Maintenance Requests
                    </h3>
                    <div className="relative w-full sm:w-64">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sky-950 h-4 w-4" />
                      <Input
                        type="text"
                        placeholder="Search by vehicle ID, issue, priority, or name..."
                        value={maintenanceSearchTerm}
                        onChange={(e) => setMaintenanceSearchTerm(e.target.value)}
                        className="pl-10 bg-transparent text-sky-950 placeholder:text-sky-950/40 border-sky-200 focus-visible:ring-sky-500"
                      />
                    </div>
                  </div>

                  {maintenanceRequests.length > 0 ? (
                    <div className="overflow-x-auto">
                    <div className="inline-block min-w-full align-middle">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-sky-50">
                          <tr>
                            <th scope="col" className="py-3 pl-4 pr-3 text-left text-xs sm:text-sm font-semibold text-sky-950">
                              Vehicle ID
                            </th>
                            <th scope="col" className="px-3 py-3 text-left text-xs sm:text-sm font-semibold text-sky-950">
                              Name
                            </th>
                            <th scope="col" className="px-3 py-3 text-left text-xs sm:text-sm font-semibold text-sky-950 hidden sm:table-cell">
                              Issue
                            </th>
                            <th scope="col" className="px-3 py-3 text-left text-xs sm:text-sm font-semibold text-sky-950">
                              Priority
                            </th>
                            <th scope="col" className="px-3 py-3 text-left text-xs sm:text-sm font-semibold text-sky-950">
                              Status
                            </th>
                            <th scope="col" className="px-3 py-3 text-left text-xs sm:text-sm font-semibold text-sky-950 hidden md:table-cell">
                              Date
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-transparent">
                          {maintenanceRequests
                            .filter(request => {
                              if (!maintenanceSearchTerm) return true;
                              const searchLower = maintenanceSearchTerm.toLowerCase();
                              return (
                                (request.vehicle_id && request.vehicle_id.toLowerCase().includes(searchLower)) ||
                                (request.issue && request.issue.toLowerCase().includes(searchLower)) ||
                                (request.priority && request.priority.toLowerCase().includes(searchLower)) ||
                                (request.name && request.name.toLowerCase().includes(searchLower))
                              );
                            })
                            .map((request) => (
                            <tr key={request.id} className="hover:bg-sky-50">
                              <td className="py-3 pl-4 pr-3 text-sm font-medium text-sky-950">
                                <div className="flex flex-col sm:block">
                                  <span className="sm:hidden text-xs text-gray-500 mb-1">Vehicle ID:</span>
                                  {request.vehicle_id}
                                </div>
                                <div className="sm:hidden text-xs text-gray-600 mt-1 line-clamp-2">
                                  {request.issue}
                                </div>
                              </td>
                              <td className="px-3 py-3 text-sm text-sky-950">
                                <div className="flex flex-col sm:block">
                                  <span className="sm:hidden text-xs text-gray-500 mb-1">Name:</span>
                                  {request.name || '—'}
                                </div>
                              </td>
                              <td className="hidden sm:table-cell px-3 py-3 text-sm text-sky-900 max-w-xs">
                                <div className="line-clamp-2">
                                  {request.issue}
                                </div>
                              </td>
                              <td className="whitespace-nowrap px-3 py-3 text-sm">
                                <div className="flex flex-col sm:block">
                                  <span className="sm:hidden text-xs text-gray-500 mb-1">Priority:</span>
                                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                    (request.priority?.trim() === 'high')
                                      ? 'bg-red-100 text-red-800' 
                                      : (request.priority?.trim() === 'medium')
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : 'bg-green-100 text-green-800'
                                  }`}>
                                    {request.priority ? (request.priority.trim().length > 0 ? request.priority.trim().charAt(0).toUpperCase() + request.priority.trim().slice(1) : '') : ''}
                                  </span>
                                </div>
                              </td>
                              <td className="whitespace-nowrap px-3 py-3 text-sm">
                                <div className="flex flex-col sm:block">
                                  <span className="sm:hidden text-xs text-gray-500 mb-1">Status:</span>
                                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                    request.status === 'completed'
                                      ? 'bg-green-100 text-green-800'
                                      : request.status === 'approved'
                                        ? 'bg-blue-100 text-blue-800'
                                        : request.status === 'rejected'
                                          ? 'bg-red-100 text-red-800'
                                          : 'bg-yellow-100 text-yellow-800'
                                  }`}>
                                    {request.status ? (request.status.length > 0 ? request.status.charAt(0).toUpperCase() + request.status.slice(1) : '') : ''}
                                  </span>
                                </div>
                              </td>
                              <td className="whitespace-nowrap px-3 py-3 text-xs sm:text-sm text-sky-950 hidden md:table-cell">
                                {request.created_at ? new Date(request.created_at).toLocaleDateString(undefined, {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                }) : "—"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
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
