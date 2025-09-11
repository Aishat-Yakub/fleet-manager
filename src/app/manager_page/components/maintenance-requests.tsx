'use client';

import { useState, useEffect } from 'react';
import { getMaintenanceRequests, updateMaintenanceRequest } from '@/services/managerService';

import { Button } from '@/components/ui/button';
import { MaintenanceRequest } from '../types';

export function MaintenanceRequests() {
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  // Removed Add Cost modal state

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const data = await getMaintenanceRequests();
        setRequests(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching maintenance requests:', error);
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  

  const handleStatusChange = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await updateMaintenanceRequest(Number(id), status, {});
      const updatedRequests = await getMaintenanceRequests();
      setRequests(updatedRequests);
    } catch (error) {
      console.error(`Error updating status to ${status}:`, error);
    }
  }

  if (loading) {
    return <div className='text-sky-600'>Loading maintenance requests...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 text-sky-900">Maintenance Requests</h2>
      <div className="space-y-4">
        {requests.length === 0 ? (
          <div className="text-center py-8 text-sky-600">No maintenance requests found.</div>
        ) : (
          <div className="space-y-3">
            {requests.map((request) => (
              <div 
                key={request.id} 
                className=" rounded-lg border border-sky-950/40 p-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                      <h3 className="font-medium text-sky-900">Vehicle ID: {request.vehicle_id}</h3>
                      <span className="flex items-center">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          request.status === 'approved' ? 'bg-green-50 text-green-700' :
                          request.status === 'rejected' ? 'bg-red-50 text-red-700' :
                          request.status === 'in_progress' ? 'bg-blue-50 text-blue-700' :
                          request.status === 'completed' ? 'bg-purple-50 text-purple-700' :
                          'bg-amber-50 text-amber-700'
                        }`}>
                          {request.status.replace('_', ' ').split(' ').map(word => 
                            word.charAt(0).toUpperCase() + word.slice(1)
                          ).join(' ')}
                        </span>
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-700">
                      <span className="font-medium text-gray-600">Issue:</span> {request.issue}
                    </p>
                    
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                      <span className="text-gray-600">
                        Requested by: <span className="text-sky-800">{request.Name || 'Unknown'}</span>
                      </span>
                      {request.estimated_cost && (
                        <span className="text-gray-600">
                          Estimated: <span className="font-medium text-sky-900">${request.estimated_cost.toFixed(2)}</span>
                        </span>
                      )}
                      <span className="text-xs text-gray-500">
                        {new Date(request.created_at).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-shrink-0 space-x-2">
                    {request.status === 'pending' || request.status === 'in_progress' && (
                      <>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                          onClick={() => handleStatusChange(request.id, 'approved')}
                        >
                          Approve
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="bg-red-600 hover:bg-red-700 text-white"
                          onClick={() => handleStatusChange(request.id, 'rejected')}
                        >
                          Reject
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

  {/* Removed Add Cost modal */}
    </div>
  );
}
