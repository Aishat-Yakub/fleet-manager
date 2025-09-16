'use client';

import { useState, useEffect } from 'react';
import { getMaintenanceRequests, updateMaintenanceRequest } from '@/services/managerService';
import { Button } from '@/components/ui/button';
import { MaintenanceRequest } from '../types';

export function MaintenanceRequests() {
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [loading, setLoading] = useState(true);

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

  const handleStatusChange = async (id: number, status: 'approved' | 'rejected') => {
    try {
      await updateMaintenanceRequest(id, status, {});
      const updatedRequests = await getMaintenanceRequests();
      setRequests(updatedRequests);
    } catch (error) {
      console.error(`Error updating status to ${status}:`, error);
    }
  };

  if (loading) {
    return <div className='text-sky-950'>Loading maintenance requests...</div>;
  }

  return (
    <div>
      <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-sky-900">Maintenance Requests</h2>
      
      {requests.length === 0 ? (
        <div className="text-center py-8 text-sky-600">No maintenance requests found.</div>
      ) : (
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      Name
                    </th>
                    <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      Vehicle ID
                    </th>
                    <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      Issue
                    </th>
                    <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      Status
                    </th>
                    <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap hidden sm:table-cell">
                      Date
                    </th>
                    <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {requests.map((request) => (
                    <tr key={request.id} className="hover:bg-gray-50">
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        <div className="sm:hidden">
                          <div className="text-xs text-gray-500 mb-1">Name</div>
                        </div>
                        {request.name || 'N/A'}
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                        <div className="sm:hidden">
                          <div className="text-xs text-gray-500 mb-1">Vehicle ID</div>
                        </div>
                        <span className="block sm:hidden truncate max-w-[80px]">{request.vehicle_id}</span>
                        <span className="hidden sm:inline">{request.vehicle_id}</span>
                      </td>
                      <td className="px-3 sm:px-6 py-4 text-sm text-gray-500 max-w-xs">
                        <div className="sm:hidden">
                          <div className="text-xs text-gray-500 mb-1">Issue</div>
                        </div>
                        <span className="block sm:hidden line-clamp-2">{request.issue}</span>
                        <span className="hidden sm:inline">{request.issue}</span>
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                        <div className="sm:hidden">
                          <div className="text-xs text-gray-500 mb-1">Status</div>
                        </div>
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
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                        {new Date(request.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="sm:hidden">
                          <div className="text-xs text-gray-500 mb-1">Actions</div>
                        </div>
                        {request.status === 'pending' && (
                          <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-2">
                            <Button
                              size="sm"
                              className='bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto'
                              onClick={() => handleStatusChange(Number(request.id), 'approved')}
                            >
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              className='bg-red-600 hover:bg-red-700 text-white w-full sm:w-auto'
                              onClick={() => handleStatusChange(Number(request.id), 'rejected')}
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
          </div>
        </div>
      )}
    </div>
  );
}
