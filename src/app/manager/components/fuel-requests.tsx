'use client';

import { useState, useEffect } from 'react';

import { Button } from '../../../components/ui/button';
import { managerService, type FuelRequest } from '../../../services/managerService';

export function FuelRequests() {
  const [requests, setRequests] = useState<FuelRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await managerService.getFuelRequests();
      setRequests(data);
    } catch (err) {
      console.error('Error fetching fuel requests:', err);
      setError('Failed to load fuel requests. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApprove = async (requestId: string) => {
    try {
      await managerService.updateFuelRequest(requestId, 'approved');
      fetchRequests(); // Refresh the list
    } catch (error) {
      console.error('Error approving request:', error);
      setError('Failed to approve the request.');
    }
  };

  const handleReject = async (requestId: string) => {
    const reason = prompt('Please provide a reason for rejection:');
    if (reason === null) return; // User cancelled the prompt
    if (!reason.trim()) {
      setError('A rejection reason is required.');
      return;
    }

    try {
      await managerService.updateFuelRequest(requestId, 'rejected', reason);
      fetchRequests(); // Refresh the list
    } catch (error) {
      console.error('Error rejecting request:', error);
      setError('Failed to reject the request.');
    }
  };

  if (loading) {
    return <div>Loading fuel requests...</div>;
  }
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 text-sky-900">Fuel Requests</h2>
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-sky-600 border-r-transparent"></div>
            <p className="mt-2 text-sky-600">Loading fuel requests...</p>
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-8 text-sky-600">No fuel requests found.</div>
        ) : (
          <div className="space-y-3">
            {requests.map((request) => (
              <div 
                key={request.id} 
                className="bg-white rounded-lg border border-gray-200 p-5 transition-shadow"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="font-medium text-sky-900">
                      {request.vehicles?.model || 'Unknown Vehicle'} ({request.vehicles?.plate_number})
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                      <span className="text-gray-600">Requested by: <span className="text-sky-800">{request.drivers?.full_name || 'Unknown Driver'}</span></span>
                      <span className="text-gray-600">Amount: <span className="font-medium text-sky-900">{request.amount} L</span></span>
                      <span className="flex items-center">
                        Status: 
                        <span className={`ml-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          request.status === 'approved' ? 'bg-green-50 text-green-700' :
                          request.status === 'rejected' ? 'bg-red-50 text-red-700' :
                          'bg-amber-50 text-amber-700'
                        }`}>
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </span>
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(request.request_date).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-shrink-0 space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleApprove(request.id)}
                      disabled={request.status !== 'pending'}
                      className="border-sky-200 text-sky-700 hover:bg-sky-50 hover:border-sky-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Approve
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleReject(request.id)}
                      disabled={request.status !== 'pending'}
                      className="border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
