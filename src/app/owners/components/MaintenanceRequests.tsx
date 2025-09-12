'use client';

import { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MaintenanceRequestForm, MaintenanceRequestsList } from './';
import { useMaintenanceRequests } from '../hooks';

type MaintenanceRequestsProps = {
  ownerId: string;
};

type MaintenanceRequestFormData = {
  vehicle_id: string;
  issue: string;
  priority: 'low' | 'medium' | 'high';
};

export function MaintenanceRequests({ ownerId }: MaintenanceRequestsProps) {
  const [showForm, setShowForm] = useState(false);
  const [newRequest, setNewRequest] = useState<MaintenanceRequestFormData>({
    vehicle_id: '',
    issue: '',
    priority: 'medium',
  });

  const {
    maintenanceRequests,
    isLoading,
    error,
    createMaintenanceRequest,
    fetchMaintenanceRequests
  } = useMaintenanceRequests(ownerId);

  const handleCreateRequest = async (e: React.FormEvent) => { 
    e.preventDefault();
    
    if (!newRequest.vehicle_id || !newRequest.issue) {
      alert('Please fill in all required fields');
      return;
    }
  
    try {
      await createMaintenanceRequest({
        vehicle_id: newRequest.vehicle_id,
        issue: newRequest.issue,
        priority: newRequest.priority,
        owner_id: '',
        name: ''
      });
      
      // Reset form and hide it
      setNewRequest({
        vehicle_id: '',
        issue: '',
        priority: 'medium',
      });
      setShowForm(false);
      
      // Refresh the list
      await fetchMaintenanceRequests();
    } catch (error) {
      console.error('Failed to create maintenance request:', error);
      alert('Failed to create maintenance request. Please try again.');
  }
  };



  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-sky-950">Vehicle Maintenance</h1>
        {!showForm && (
          <Button
            onClick={() => setShowForm(true)}
            className="bg-sky-600 hover:bg-sky-700 text-white"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            New Maintenance Request
          </Button>
        )}
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow">
          <MaintenanceRequestForm
            newMaintenanceRequest={newRequest}
            onUpdate={(updates) => setNewRequest(prev => ({
              ...prev,
              ...updates,
              owner_id: ownerId // Ensure owner_id is always set
            }))}
            onSubmit={handleCreateRequest}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8">
        <MaintenanceRequestsList 
          maintenanceRequests={maintenanceRequests} 
          isLoading={isLoading} 
        />
      </div>
    </div>
  );
}
