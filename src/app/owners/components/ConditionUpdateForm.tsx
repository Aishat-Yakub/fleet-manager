'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import { ConditionUpdate } from '../types';

type ConditionUpdateFormProps = {
  newConditionUpdate: ConditionUpdate;
  onUpdate: (update: ConditionUpdate) => void;
  onSubmit: (e: React.FormEvent) => void;
};

export function ConditionUpdateForm({ newConditionUpdate, onUpdate, onSubmit }: ConditionUpdateFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="vehicleId" className="block text-sm font-medium text-sky-950">
            Vehicle ID
          </Label>
          <Input
            id="vehicleId"
            type="text"
            value={newConditionUpdate.vehicle_id || ''}
            onChange={(e) => onUpdate({ ...newConditionUpdate, vehicle_id: e.target.value })}
            className="mt-1 block w-full rounded-md border border-sky-900 bg-transparent shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
            required
          />
        </div>

        <div>
          <Label htmlFor="status" className="block text-sm font-medium text-sky-950">
            Condition Status
          </Label>
          <select
            id="status"
            value={newConditionUpdate.condition}
            onChange={(e) =>
              onUpdate({
                ...newConditionUpdate,
                condition: e.target.value as 'Good' | 'Fair' | 'Poor',
              })
            }
            className="mt-1 block w-full py-3 rounded-md border border-sky-900 bg-transparent focus:border-sky-500 focus:ring-sky-500 sm:text-sm text-sky-950"
            required
          >
            <option value="Good">Good</option>
            <option value="Fair">Fair</option>
            <option value="Poor">Poor</option>
          </select>
        </div>

        <div>
          <Label htmlFor="notes" className="block text-sm font-medium text-sky-950">
            Notes
          </Label>
          <Textarea
            id="notes"
            rows={3}
            value={newConditionUpdate.notes}
            onChange={(e) => onUpdate({ ...newConditionUpdate, notes: e.target.value })}
            className="mt-1 block w-full rounded-md border border-sky-900 bg-transparent focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
          />
        </div>
      </div>

      <div className="pt-2">
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
          Submit Update
        </Button>
      </div>
    </form>
  );
}
