'use client';

import { MaintenanceRequest } from '@/services/auditorService';

interface MaintenanceRequestsTableProps {
  maintenanceRequests: MaintenanceRequest[];
  filteredData: MaintenanceRequest[] | null;
}

export default function MaintenanceRequestsTable({ maintenanceRequests, filteredData }: MaintenanceRequestsTableProps) {
  const formatStatus = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-transparent rounded-lg border border-gray-200">
      {/* Header */}
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Maintenance Requests</h3>
        <p className="mt-1 text-sm text-gray-500">List of all maintenance requests</p>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden divide-y divide-gray-200">
        {(filteredData || maintenanceRequests).map((request: MaintenanceRequest) => (
          <div key={request.id} className="p-3 xs:p-4 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="text-sm xs:text-base font-medium text-gray-900 truncate">{request.name}</h4>
                <p className="text-xs xs:text-sm text-gray-500 truncate">{request.vehicle_id}</p>
              </div>
              <div className="flex flex-col gap-1">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(request.priority)}`}>
                  {formatStatus(request.priority)}
                </span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(request.status)}`}>
                  {formatStatus(request.status)}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-2 xs:gap-3 text-xs xs:text-sm">
              <div>
                <span className="text-gray-500">Issue:</span>
                <span className="ml-1 text-gray-900">{request.issue}</span>
              </div>
              <div>
                <span className="text-gray-500">Date:</span>
                <span className="ml-1 text-gray-900">
                  {new Date(request.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tablet and Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-transparent">
            <tr>
              <th className="px-3 xs:px-4 md:px-6 py-2 xs:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-3 xs:px-4 md:px-6 py-2 xs:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle ID</th>
              <th className="px-3 xs:px-4 md:px-6 py-2 xs:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issue</th>
              <th className="px-3 xs:px-4 md:px-6 py-2 xs:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
              <th className="px-3 xs:px-4 md:px-6 py-2 xs:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-3 xs:px-4 md:px-6 py-2 xs:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody className="bg-transparent divide-y divide-gray-200">
            {(filteredData || maintenanceRequests).map((request: MaintenanceRequest) => (
              <tr key={request.id} className="transition-colors">
                <td className="px-3 xs:px-4 md:px-6 py-2 xs:py-4 whitespace-nowrap text-xs xs:text-sm font-medium text-gray-900 truncate">{request.name}</td>
                <td className="px-3 xs:px-4 md:px-6 py-2 xs:py-4 whitespace-nowrap text-xs xs:text-sm text-gray-500 truncate">{request.vehicle_id}</td>
                <td className="px-3 xs:px-4 md:px-6 py-2 xs:py-4 whitespace-nowrap text-xs xs:text-sm text-gray-500 truncate">{request.issue}</td>
                <td className="px-3 xs:px-4 md:px-6 py-2 xs:py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(request.priority)}`}>
                    {formatStatus(request.priority)}
                  </span>
                </td>
                <td className="px-3 xs:px-4 md:px-6 py-2 xs:py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(request.status)}`}>
                    {formatStatus(request.status)}
                  </span>
                </td>
                <td className="px-3 xs:px-4 md:px-6 py-2 xs:py-4 whitespace-nowrap text-xs xs:text-sm text-gray-500">
                  {new Date(request.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {(filteredData || maintenanceRequests).length === 0 && (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No maintenance requests found</h3>
          <p className="mt-1 text-sm text-gray-500">No maintenance requests match your search criteria.</p>
        </div>
      )}
    </div>
  );
}
