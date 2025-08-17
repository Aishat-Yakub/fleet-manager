'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ConditionUpdate {
  id: number;
  date: string;
  status: string;
  notes: string;
  vehicle: {
    name: string;
  };
}

interface ConditionUpdatesProps {
  // ownerId is no longer needed
}

export const ConditionUpdates = (props: ConditionUpdatesProps) => {
  const [conditionUpdates, setConditionUpdates] = useState<ConditionUpdate[]>([]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Condition Updates</CardTitle>
      </CardHeader>
      <CardContent>
        {conditionUpdates.length > 0 ? (
          <div className="space-y-4">
            {conditionUpdates.map((update) => (
              <div key={update.id} className="p-4 border rounded-lg">
                <p className="font-semibold">{update.vehicle.name}</p>
                <p>Status: {update.status}</p>
                <p>Notes: {update.notes}</p>
                <p className="text-sm text-gray-500">{new Date(update.date).toLocaleString()}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No condition updates available.</p>
        )}
      </CardContent>
    </Card>
  );
};
