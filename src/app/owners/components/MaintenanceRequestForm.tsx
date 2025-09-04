'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

type MaintenanceRequestFormProps = {
  newMaintenanceRequest: {
    vehicle_id: string;
    issue: string;
    priority: 'low' | 'medium' | 'high';
  };
  onUpdate: (updates: Partial<{
    vehicle_id: string;
    issue: string;
    priority: 'low' | 'medium' | 'high';
  }>) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onCancel: () => void;
};

export function MaintenanceRequestForm({
  newMaintenanceRequest,
  onUpdate,
  onSubmit,
  onCancel,
}: MaintenanceRequestFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="vehicle_id">Vehicle ID</Label>
        <Input
          id="vehicle_id"
          type="text"
          value={newMaintenanceRequest.vehicle_id}
          onChange={(e) => onUpdate({ vehicle_id: e.target.value })}
          placeholder="Enter vehicle ID"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="issue">Issue</Label>
        <Textarea
          id="issue"
          value={newMaintenanceRequest.issue}
          onChange={(e) => onUpdate({ issue: e.target.value })}
          placeholder="Describe the issue"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="priority">Priority</Label>
        <Select
          value={newMaintenanceRequest.priority}
          onValueChange={(value: 'low' | 'medium' | 'high') => onUpdate({ priority: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Submit Request</Button>
      </div>
    </form>
  );
}
