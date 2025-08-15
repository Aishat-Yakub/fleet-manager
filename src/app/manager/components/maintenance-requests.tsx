'use client';

import { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { managerService } from '@/services/managerService';

import { MaintenanceRequest } from '../types';

export function MaintenanceRequests() {
  const [requests] = useState<MaintenanceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<MaintenanceRequest | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [estimatedCost, setEstimatedCost] = useState('');

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        // Replace with actual API call when available
        // const data = await managerService.getMaintenanceRequests();
        // setRequests(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching maintenance requests:', error);
        setLoading(false);
      }
    };

    fetchRequests();
  }, []); 

  const handleApprove = async (requestId: string) => {
    try {
      await managerService.updateMaintenanceRequest(requestId, 'approved');
      // Refresh requests
      // const updatedRequests = await managerService.getMaintenanceRequests();
      // setRequests(updatedRequests);
    } catch (error) {
      console.error('Error approving request:', error);
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      await managerService.updateMaintenanceRequest(requestId, 'rejected', 'Not approved');
      // Refresh requests
      // const updatedRequests = await managerService.getMaintenanceRequests();
      // setRequests(updatedRequests);
    } catch (error) {
      console.error('Error rejecting request:', error);
    }
  };



  const handleEstimateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequest) return;

    try {
      // Here you would typically update the maintenance request with the estimated cost
      // await managerService.updateMaintenanceRequest(selectedRequest.id, 'in_progress', {
      //   estimatedCost: parseFloat(estimatedCost)
      // });
      
      // Refresh requests
      // const updatedRequests = await managerService.getMaintenanceRequests();
      // setRequests(updatedRequests);
      
      setShowDetails(false);
      setEstimatedCost('');
    } catch (error) {
      console.error('Error submitting estimate:', error);
    }
  };

  if (loading) {
    return <div>Loading maintenance requests...</div>;
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
                className="bg-white rounded-lg border border-gray-200 p-5 transition-shadow"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                      <h3 className="font-medium text-sky-900">{request.vehicleMake} {request.vehicleModel}</h3>
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
                        Requested by: <span className="text-sky-800">{request.requestedBy}</span>
                      </span>
                      {request.estimatedCost && (
                        <span className="text-gray-600">
                          Estimated: <span className="font-medium text-sky-900">${request.estimatedCost.toFixed(2)}</span>
                        </span>
                      )}
                      <span className="text-xs text-gray-500">
                        {new Date(request.requestedAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-shrink-0 space-x-2">
                    {request.status === 'pending' && (
                      <>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleApprove(request.id)}
                          className="border-sky-200 text-sky-700 hover:bg-sky-50 hover:border-sky-300"
                        >
                          Approve
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleReject(request.id)}
                          className="border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300"
                        >
                          Reject
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setSelectedRequest(request);
                            setShowDetails(true);
                          }}
                          className="border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300"
                        >
                          Add Cost
                        </Button>
                      </>
                    )}
                    {request.status === 'approved' && !request.estimatedCost && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setSelectedRequest(request);
                          setShowDetails(true);
                        }}
                        className="border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300"
                      >
                        Add Cost
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Estimate Modal */}
      {showDetails && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">Add Estimated Cost</h3>
            <form onSubmit={handleEstimateSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estimated Cost ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className="w-full p-2 border rounded"
                  value={estimatedCost}
                  onChange={(e) => setEstimatedCost(e.target.value)}
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowDetails(false)}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  className="bg-sky-600 hover:bg-sky-700 text-white"
                >
                  Submit Estimate
                </Button>
              </div>
            </form>
            </div>
          </div>
        )}
    </div>
  );
}
