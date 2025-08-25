'use client';

import { Wrench } from 'lucide-react';
import { MaintenanceRequest } from '../types';

type MaintenanceRequestsListProps = {
  maintenanceRequests: MaintenanceRequest[];
  isLoading?: boolean;
};

export function MaintenanceRequestsList({ maintenanceRequests, isLoading = false }: MaintenanceRequestsListProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-600"></div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { bg: string; text: string; label: string }> = {
      'pending': { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
      'in-progress': { bg: 'bg-blue-100', text: 'text-blue-800', label: 'In Progress' },
      'completed': { bg: 'bg-green-100', text: 'text-green-800', label: 'Completed' },
      'rejected': { bg: 'bg-red-100', text: 'text-red-800', label: 'Rejected' },
    };

    const statusInfo = statusMap[status] || { bg: 'bg-gray-100', text: 'text-gray-800', label: status };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.bg} ${statusInfo.text}`}>
        {statusInfo.label}
      </span>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const priorityMap: Record<string, { bg: string; text: string }> = {
      high: { bg: 'bg-red-100', text: 'text-red-800' },
      medium: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
      low: { bg: 'bg-green-100', text: 'text-green-800' },
    };

    const priorityInfo = priorityMap[priority.toLowerCase()] || { bg: 'bg-gray-100', text: 'text-gray-800' };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityInfo.bg} ${priorityInfo.text}`}>
        {priority.charAt(0).toUpperCase() + priority.slice(1).toLowerCase()}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-300">
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
                  <td className="px-3 py-4 text-sm text-sky-900 max-w-xs break-words">
                    {request.issue}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm">
                    {getPriorityBadge(request.priority)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm">
                    {getStatusBadge(request.status)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-sky-950">
                    {request.createdAt ? formatDate(request.createdAt) : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {maintenanceRequests.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
          <Wrench className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No maintenance requests</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new maintenance request.</p>
        </div>
      )}
    </div>
  );
}
