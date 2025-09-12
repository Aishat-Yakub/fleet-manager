'use client';

import { useState, useEffect } from 'react';
import { Button } from '../../../../components/ui/button';
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
    return <div className='text-sky-950 border border-sky-950 p-5 rounded-md'>Loading fuel requests...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 text-sky-900">Fuel Requests</h2>
      
      {requests.length === 0 ? (
        <div className="text-center py-8 text-sky-600">No fuel requests found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vehicle ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Litres
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reason
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bank
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Account
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {requests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {request.Name || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                    {request.vehicle_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {request.litres}L
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">
                    {request.reason || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {request.bank}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                    {request.account}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      request.status === 'approved' ? 'bg-green-100 text-green-800' :
                      request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(request.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {request.status === 'pending' && (
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          className='bg-blue-600 font-bold hover:bg-blue-700 text-white'
                          onClick={() => handleStatusChange(request.id, 'approved')}
                        >
                            Approve
                        </Button>
                        <Button
                          size="sm"
                          className='bg-red-600 font-bold hover:bg-red-700 text-white'
                          onClick={() => handleStatusChange(request.id, 'rejected')}
                        >
                          Reject
                        </Button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
