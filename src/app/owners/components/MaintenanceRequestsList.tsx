'use client';

import { Wrench } from 'lucide-react';
import { MaintenanceRequest } from '../types';

type MaintenanceRequestsListProps = {
  maintenanceRequests: MaintenanceRequest[];
};

export function MaintenanceRequestsList({ maintenanceRequests }: MaintenanceRequestsListProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-sky-950">Maintenance Requests</h2>
      </div>

      {maintenanceRequests.length > 0 ? (
        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
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
                  <td className="px-3 py-4 text-sm text-sky-900 max-w-xs truncate">
                    {request.issue}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      request.priority === 'high' 
                        ? 'bg-red-100 text-red-800' 
                        : request.priority === 'medium'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                    }`}>
                      {request.priority.charAt(0).toUpperCase() + request.priority.slice(1)}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      request.status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : request.status === 'rejected' 
                          ? 'bg-red-100 text-red-800' 
                          : request.status === 'in-progress' 
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {request.status.split('-').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1)
                      ).join(' ')}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-sky-950">
                    {new Date(request.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
          <Wrench className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No maintenance requests</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new maintenance request.</p>
        </div>
      )}
    </div>
  );
}
