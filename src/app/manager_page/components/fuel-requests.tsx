'use client';

import { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/button';
import { getFuelRequests, updateFuelRequestStatus } from '@/services/managerService';
import { FuelRequest } from '../types';

export function FuelRequests() {
  const [requests, setRequests] = useState<FuelRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const data = await getFuelRequests();
        setRequests(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching fuel requests:', error);
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const handleStatusChange = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await updateFuelRequestStatus(id, status);
      const updatedRequests = await getFuelRequests();
      setRequests(updatedRequests);
    } catch (error) {
      console.error(`Error updating status to ${status}:`, error);
    }
  };

  if (loading) {
    return <div>Loading fuel requests...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 text-sky-900">Fuel Requests</h2>
      <div className="space-y-3">
        {requests.length === 0 ? (
          <div className="text-center py-8 text-sky-600">No fuel requests found.</div>
        ) : (
          requests.map((request) => (
            <div key={request.id} className="bg-white rounded-lg border border-gray-200 p-5 transition-shadow">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="font-medium text-sky-900">
                    {request.vehicleMake} {request.vehicleModel}
                  </h3>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                    <span className="text-gray-600">
                      Requested by: <span className="text-sky-800">{request.requestedBy}</span>
                    </span>
                    <span className="text-gray-600">
                      Amount: <span className="font-medium text-sky-900">{request.amount} L</span>
                    </span>
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
                    <span className="text-xs text-gray-500">{new Date(request.requestedAt).toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex flex-shrink-0 space-x-2">
                  {request.status === 'pending' && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-sky-200 text-sky-700 hover:bg-sky-50 hover:border-sky-300"
                        onClick={() => handleStatusChange(request.id, 'approved')}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300"
                        onClick={() => handleStatusChange(request.id, 'rejected')}
                      >
                        Reject
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
