'use client';

import { Plus } from 'lucide-react';
import { FuelRequest } from '../types';
import { Button } from '@/components/ui/button';

type FuelRequestsListProps = {
  fuelRequests: FuelRequest[];
  onAddClick: () => void;
};

export function FuelRequestsList({ fuelRequests, onAddClick }: FuelRequestsListProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-sky-950">Fuel Requests</h2>
        <Button
          onClick={onAddClick}
          className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          New Request
        </Button>
      </div>

      <div className="space-y-4">
        {fuelRequests.length > 0 ? (
          fuelRequests.map((request) => (
            <div key={request.id} className="border border-sky-950 rounded-lg p-4 bg-white">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <p className="font-medium">
                    {request.vehicle || `Vehicle ID: ${request.vehicleId}`}
                  </p>
                  <p className="text-sm text-gray-500">
                    {request.amount}L • {new Date(request.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                    {request.notes && (
                      <span className="block mt-1 text-gray-600">
                        {request.notes}
                      </span>
                    )}
                  </p>
                </div>
                <span 
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    request.status === 'Approved' 
                      ? 'bg-green-100 text-green-800' 
                      : request.status === 'Rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {request.status}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
            <p className="text-gray-500">No fuel requests found</p>
            <Button
              onClick={onAddClick}
              variant="outline"
              className="mt-4 text-sky-950 border-sky-300 hover:bg-sky-50"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create your first request
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
