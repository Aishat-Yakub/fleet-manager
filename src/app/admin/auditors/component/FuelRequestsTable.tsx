'use client';

import { FuelRequest } from '@/services/auditorService';

interface FuelRequestsTableProps {
  fuelRequests: FuelRequest[];
  filteredData: FuelRequest[] | null;
}

export default function FuelRequestsTable({ fuelRequests, filteredData }: FuelRequestsTableProps) {
  const formatStatus = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
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
        <h3 className="text-lg font-medium text-gray-900">Fuel Requests</h3>
        <p className="mt-1 text-sm text-gray-500">List of all fuel requests</p>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden divide-y divide-gray-200">
        {(filteredData || fuelRequests).map((request: FuelRequest) => (
          <div key={request.id} className="p-3 xs:p-4 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="text-sm xs:text-base font-medium text-gray-900 truncate">{request.Name}</h4>
                <p className="text-xs xs:text-sm text-gray-500 truncate">{request.vehicle_id}</p>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(request.status)}`}>
                {formatStatus(request.status)}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-2 xs:gap-3 text-xs xs:text-sm">
              <div>
                <span className="text-gray-500">Litres:</span>
                <span className="ml-1 text-gray-900">{request.litres}L</span>
              </div>
              <div>
                <span className="text-gray-500">Bank:</span>
                <span className="ml-1 text-gray-900">{request.bank}</span>
              </div>
              <div className="col-span-2">
                <span className="text-gray-500">Reason:</span>
                <span className="ml-1 text-gray-900">{request.reason}</span>
              </div>
              <div>
                <span className="text-gray-500">Account:</span>
                <span className="ml-1 text-gray-900">{request.account}</span>
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
              <th className="px-3 xs:px-4 md:px-6 py-2 xs:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Litres</th>
              <th className="px-3 xs:px-4 md:px-6 py-2 xs:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
              <th className="px-3 xs:px-4 md:px-6 py-2 xs:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-3 xs:px-4 md:px-6 py-2 xs:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bank</th>
              <th className="px-3 xs:px-4 md:px-6 py-2 xs:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account</th>
              <th className="px-3 xs:px-4 md:px-6 py-2 xs:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody className="bg-transparent divide-y divide-gray-200">
            {(filteredData || fuelRequests).map((request: FuelRequest) => (
              <tr key={request.id} className="transition-colors">
                <td className="px-3 xs:px-4 md:px-6 py-2 xs:py-4 whitespace-nowrap text-xs xs:text-sm font-medium text-gray-900 truncate">{request.Name}</td>
                <td className="px-3 xs:px-4 md:px-6 py-2 xs:py-4 whitespace-nowrap text-xs xs:text-sm text-gray-500 truncate">{request.vehicle_id}</td>
                <td className="px-3 xs:px-4 md:px-6 py-2 xs:py-4 whitespace-nowrap text-xs xs:text-sm text-gray-500 truncate">{request.litres}L</td>
                <td className="px-3 xs:px-4 md:px-6 py-2 xs:py-4 whitespace-nowrap text-xs xs:text-sm text-gray-500 truncate">{request.reason}</td>
                <td className="px-3 xs:px-4 md:px-6 py-2 xs:py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(request.status)}`}>
                    {formatStatus(request.status)}
                  </span>
                </td>
                <td className="px-3 xs:px-4 md:px-6 py-2 xs:py-4 whitespace-nowrap text-xs xs:text-sm text-gray-500 truncate">{request.bank}</td>
                <td className="px-3 xs:px-4 md:px-6 py-2 xs:py-4 whitespace-nowrap text-xs xs:text-sm text-gray-500 truncate">{request.account}</td>
                <td className="px-3 xs:px-4 md:px-6 py-2 xs:py-4 whitespace-nowrap text-xs xs:text-sm text-gray-500">
                  {new Date(request.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {(filteredData || fuelRequests).length === 0 && (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No fuel requests found</h3>
          <p className="mt-1 text-sm text-gray-500">No fuel requests match your search criteria.</p>
        </div>
      )}
    </div>
  );
}
