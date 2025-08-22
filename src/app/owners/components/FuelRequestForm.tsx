'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FuelRequest } from '../types';

type FuelRequestFormProps = {
  newFuelRequest: FuelRequest;
  onUpdate: (update: FuelRequest) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
};

export function FuelRequestForm({ newFuelRequest, onUpdate, onSubmit, onCancel }: FuelRequestFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <h3 className="text-lg font-medium text-sky-950">New Fuel Request</h3>
      
      <div>
        <Label htmlFor="fuel-vehicle-id" className="block text-sm font-medium text-sky-950 mb-1">
          Vehicle ID
        </Label>
        <Input
          id="fuel-vehicle-id"
          type="text"
          value={newFuelRequest.vehicle_id || ''}
          onChange={(e) => onUpdate({ ...newFuelRequest, vehicle_id: e.target.value })}
          className="mt-1 block w-full border border-sky-900 bg-transparent text-sky-950 focus:border-sky-500 focus:ring-sky-500 sm:text-sm rounded-md"
          required
        />
      </div>

      <div>
        <Label htmlFor="fuel-amount" className="block text-sm font-medium text-sky-950 mb-1">
          Amount (Liters)
        </Label>
        <Input
          id="fuel-litres"
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={newFuelRequest.litres || ''}
          onChange={(e) => onUpdate({ ...newFuelRequest, litres: e.target.value })}
          className="mt-1 block w-full border border-sky-900 bg-transparent text-sky-950 focus:border-sky-500 focus:ring-sky-500 sm:text-sm rounded-md"
          required
        />
      </div>

      <div>
        <Label htmlFor="fuel-notes" className="block text-sm font-medium text-sky-950 mb-1">
          Reason
        </Label>
        <Textarea
          id="fuel-reason"
          rows={3}
          value={newFuelRequest.reason || ''}
          onChange={(e) => onUpdate({ ...newFuelRequest, reason: e.target.value })}
          className="mt-1 block w-full border border-sky-900 bg-transparent text-sky-950 focus:border-sky-500 focus:ring-sky-500 sm:text-sm rounded-md"
          placeholder="Enter the reason for fuel request"
          required
        />
      </div>

      <div className="flex justify-end space-x-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="border-sky-300 text-sky-950 hover:bg-sky-50"
        >
          Cancel
        </Button>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
          Submit Request
        </Button>
      </div>
    </form>
  );
}
