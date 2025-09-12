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
      {requests.length === 0 ? (
        <div className="text-center py-8 text-sky-600">No maintenance requests found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="text-sky-950">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vehicle ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Issue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {requests.map((request) => (
                <tr key={request.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {request.vehicle_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {request.name || 'Unknown'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                    {request.issue}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      request.status === 'approved' ? 'bg-green-100 text-green-800' :
                      request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      request.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                      request.status === 'completed' ? 'bg-purple-100 text-purple-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {request.status.replace('_', ' ').split(' ').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1)
                      ).join(' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(request.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    {(request.status === 'pending' || request.status === 'in_progress') && (
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleStatusChange(request.id, 'approved')}
                          className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleStatusChange(request.id, 'rejected')}
                          className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          Reject
                        </button>
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
