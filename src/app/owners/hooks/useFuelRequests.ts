import { useState, useCallback } from 'react';
import { FuelRequest } from '../types';
import { fetchApi } from '@/lib/api';

export const useFuelRequests = (ownerId: string) => {
  const [fuelRequests, setFuelRequests] = useState<FuelRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFuelRequests = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const data = await fetchApi<FuelRequest[]>(`/fuel-requests?ownerId=${ownerId}`);
      setFuelRequests(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching fuel requests:', err);
    } finally {
      setIsLoading(false);
    }
  }, [ownerId]);

  const createFuelRequest = useCallback(async (requestData: Omit<FuelRequest, 'id' | 'date' | 'status'>) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const newRequest = await fetchApi<FuelRequest>('/fuel-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...requestData,
          owner_id: ownerId,
        }),
      });
      
      setFuelRequests(prev => [...prev, newRequest]);
      return { success: true, data: newRequest };
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to create fuel request';
      setError(error);
      console.error('Error creating fuel request:', err);
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  }, [ownerId]);

  return {
    fuelRequests,
    isLoading,
    error,
    fetchFuelRequests,
    createFuelRequest,
  };
};
