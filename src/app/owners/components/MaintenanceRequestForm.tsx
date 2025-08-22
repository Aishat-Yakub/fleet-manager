'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MaintenanceRequest } from '../types';

type MaintenanceRequestFormProps = {
  newMaintenanceRequest: MaintenanceRequest;
  onUpdate: (update: MaintenanceRequest) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
};

export function MaintenanceRequestForm({ newMaintenanceRequest, onUpdate, onSubmit, onCancel }: MaintenanceRequestFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <h3 className="text-lg font-medium text-sky-950">New Maintenance Request</h3>
      <div className="space-y-4">
        <div>
          <Label htmlFor="maintenance-vehicle-id" className="block text-sm font-medium text-sky-950 mb-1">
            Vehicle ID
          </Label>
          <Input
            id="maintenance-vehicle-id"
            type="text"
            value={newMaintenanceRequest.vehicle_id || ''}
            onChange={(e) => onUpdate({ ...newMaintenanceRequest, vehicle_id: e.target.value, vehicleId: e.target.value })}
            className="mt-1 block w-full border border-sky-900 bg-transparent text-sky-950 focus:border-sky-500 focus:ring-sky-500 sm:text-sm rounded-md"
            required
          />
        </div>

        <div>
          <Label htmlFor="issue" className="block text-sm font-medium text-sky-950 mb-1">
            Issue Description
          </Label>
          <Textarea
            id="maintenance-issue"
            rows={3}
            value={newMaintenanceRequest.issue || ''}
            onChange={(e) => onUpdate({ ...newMaintenanceRequest, issue: e.target.value })}
            className="mt-1 block w-full border border-sky-900 bg-transparent text-sky-950 py-2 pl-3 pr-10 text-base focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm rounded-md"
            required
          />
        </div>

        <div>
          <Label htmlFor="priority" className="block text-sm font-medium text-sky-950 mb-1">
            Priority
          </Label>
          <Textarea
            id="maintenance-priority"
            rows={1}
            value={newMaintenanceRequest.priority || 'medium'}
            onChange={(e) => onUpdate({ ...newMaintenanceRequest, priority: e.target.value as 'low' | 'medium' | 'high' })}
            className="mt-1 block w-full border border-sky-900 bg-transparent text-sky-950 py-2 pl-3 pr-10 text-base focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm rounded-md"
            required
          />
        </div>
      </div>

      <div className="pt-4">
        <div className="flex justify-end space-x-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="border-sky-300 text-sky-950 hover:bg-sky-50"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-sky-600 hover:bg-sky-700 text-white"
          >
            Submit Request
          </Button>
        </div>
      </div>
    </form>
  );
}
