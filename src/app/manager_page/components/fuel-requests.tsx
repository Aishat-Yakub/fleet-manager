'use client';

import { Button } from '../../../components/ui/button';

export function FuelRequests() {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 text-sky-900">Fuel Requests</h2>

      <div className="space-y-3">
        {/* Example Request Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-5 transition-shadow">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <h3 className="font-medium text-sky-900">
                Toyota Corolla (ABC-123)
              </h3>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                <span className="text-gray-600">
                  Requested by: <span className="text-sky-800">John Doe</span>
                </span>
                <span className="text-gray-600">
                  Amount: <span className="font-medium text-sky-900">50 L</span>
                </span>
                <span className="flex items-center">
                  Status:
                  <span className="ml-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700">
                    Pending
                  </span>
                </span>
                <span className="text-xs text-gray-500">2025-08-20 10:30 AM</span>
              </div>
            </div>
            <div className="flex flex-shrink-0 space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="border-sky-200 text-sky-700 hover:bg-sky-50 hover:border-sky-300"
              >
                Approve
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300"
              >
                Reject
              </Button>
            </div>
          </div>
        </div>

        {/* Example Empty State */}
        <div className="text-center py-8 text-sky-600">
          No fuel requests found.
        </div>
      </div>
    </div>
  );
}
