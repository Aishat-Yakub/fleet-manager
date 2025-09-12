'use client';

import { Vehicle } from '@/services/auditorService';

interface VehiclesTableProps {
  vehicles: Vehicle[];
  filteredData: Vehicle[] | null;
}

export default function VehiclesTable({ vehicles, filteredData }: VehiclesTableProps) {
  const formatStatus = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'good':
        return 'bg-green-100 text-green-800';
      case 'fair':
        return 'bg-yellow-100 text-yellow-800';
      case 'poor':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-transparent rounded-lg border border-gray-200">
      {/* Header */}
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Vehicles</h3>
        <p className="mt-1 text-sm text-gray-500">List of all registered vehicles</p>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden divide-y divide-gray-200">
        {(filteredData || vehicles).map((vehicle: Vehicle) => (
          <div key={vehicle.id} className="p-3 xs:p-4 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="text-sm xs:text-base font-medium text-gray-900 truncate">{vehicle.plate_number}</h4>
                <p className="text-xs xs:text-sm text-gray-500 truncate">{vehicle.model}</p>
              </div>
              <div className="flex flex-col gap-1">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(vehicle.condition)}`}>
                  {formatStatus(vehicle.condition)}
                </span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${vehicle.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                  {formatStatus(vehicle.status)}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 xs:gap-3 text-xs xs:text-sm">
              <div>
                <span className="text-gray-500">Color:</span>
                <span className="ml-1 text-gray-900">{vehicle.color}</span>
              </div>
              <div>
                <span className="text-gray-500">Owner:</span>
                <span className="ml-1 text-gray-900">{vehicle.Name}</span>
              </div>
              <div className="col-span-2">
                <span className="text-gray-500">Registration:</span>
                <span className="ml-1 text-gray-900">
                  {new Date(vehicle.registration_date).toLocaleDateString()}
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
              <th className="px-3 xs:px-4 md:px-6 py-2 xs:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plate Number</th>
              <th className="px-3 xs:px-4 md:px-6 py-2 xs:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model</th>
              <th className="px-3 xs:px-4 md:px-6 py-2 xs:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Color</th>
              <th className="px-3 xs:px-4 md:px-6 py-2 xs:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Condition</th>
              <th className="px-3 xs:px-4 md:px-6 py-2 xs:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-3 xs:px-4 md:px-6 py-2 xs:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
              <th className="px-3 xs:px-4 md:px-6 py-2 xs:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registration Date</th>
            </tr>
          </thead>
          <tbody className="bg-transparent divide-y divide-gray-200">
            {(filteredData || vehicles).map((vehicle: Vehicle) => (
              <tr key={vehicle.id} className="transition-colors">
                <td className="px-3 xs:px-4 md:px-6 py-2 xs:py-4 whitespace-nowrap text-xs xs:text-sm font-medium text-gray-900 truncate">{vehicle.plate_number}</td>
                <td className="px-3 xs:px-4 md:px-6 py-2 xs:py-4 whitespace-nowrap text-xs xs:text-sm text-gray-500 truncate">{vehicle.model}</td>
                <td className="px-3 xs:px-4 md:px-6 py-2 xs:py-4 whitespace-nowrap text-xs xs:text-sm text-gray-500 truncate">{vehicle.color}</td>
                <td className="px-3 xs:px-4 md:px-6 py-2 xs:py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(vehicle.condition)}`}>
                    {formatStatus(vehicle.condition)}
                  </span>
                </td>
                <td className="px-3 xs:px-4 md:px-6 py-2 xs:py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${vehicle.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {formatStatus(vehicle.status)}
                  </span>
                </td>
                <td className="px-3 xs:px-4 md:px-6 py-2 xs:py-4 whitespace-nowrap text-xs xs:text-sm text-gray-500 truncate">{vehicle.Name}</td>
                <td className="px-3 xs:px-4 md:px-6 py-2 xs:py-4 whitespace-nowrap text-xs xs:text-sm text-gray-500">
                  {new Date(vehicle.registration_date).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {(filteredData || vehicles).length === 0 && (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No vehicles found</h3>
          <p className="mt-1 text-sm text-gray-500">No vehicles match your search criteria.</p>
        </div>
      )}
    </div>
  );
}
