'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle } from 'lucide-react';
import { Alert,AlertTitle,AlertDescription } from '@/components/ui/alert';

interface ConditionUpdate {
  id: number;
  date: string;
  status: string;   
  notes: string;
  vehicleId: string;
  vehicleName?: string;
}

interface ConditionUpdatesProps {
  ownerId: string | number;
}

export function ConditionUpdates({ ownerId }: ConditionUpdatesProps) {
  const [updates, setUpdates] = useState<ConditionUpdate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConditionUpdates = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/owners/${ownerId}/condition-updates`);
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
        
        const data = await response.json();
        setUpdates(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch condition updates:', err);
        setError('Failed to load condition updates. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchConditionUpdates();
  }, [ownerId]);

  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'good':
        return 'bg-green-100 text-green-800';
      case 'needs attention':
        return 'bg-yellow-100 text-yellow-800';
      case 'maintenance required':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2">Loading condition updates...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
        <Button 
          variant="outline" 
          className="mt-2"
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </Alert>
    );
  }

  if (updates.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Condition Updates</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">No condition updates found for this vehicle.</p>
        </CardContent>
      </Card>
    );
  }

  // Main return statement that renders the condition updates card
  return (
    <Card>
      {/* Card header with title and refresh button */}
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Condition Updates</CardTitle>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => window.location.reload()}
          aria-label="Refresh condition updates"
        >
          Refresh
        </Button>
      </CardHeader>
      
      {/* Card content area */}
      <CardContent className="space-y-4">
        {/* Map through each condition update and render it */}
        {updates.map((update) => (
          // Individual update card with hover effect
          <div 
            key={update.id} 
            className="border rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            {/* Flex container for update header (date and status) */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              {/* Left side: Update date and vehicle name */}
              <div>
                {/* Formatted date display */}
                <span className="font-medium text-gray-900">
                  {new Date(update.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
                {/* Display vehicle name if available */}
                {update.vehicleName && (
                  <span className="ml-2 text-sm text-gray-500">
                    • {update.vehicleName}
                  </span>
                )}
              </div>
              {/* Right side: Status badge with dynamic styling */}
              <span 
                className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(update.status)}`}
                aria-label={`Status: ${update.status}`}
              >
                {update.status}
              </span>
            </div>
            
            {/* Display notes if available */}
            {update.notes && (
              <p className="mt-2 text-sm text-gray-700">
                {update.notes}
              </p>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
