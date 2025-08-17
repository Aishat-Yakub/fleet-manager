import { useState, useCallback } from 'react';

export const useFuelRequests = (ownerId: string) => {
  const [fuelRequests, setFuelRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFuelRequests = useCallback(async () => {
    // This function is cleared to remove backend dependencies.
  }, []);

  const createFuelRequest = useCallback(async (requestData: any) => {
    // This function is cleared to remove backend dependencies.
    return { success: true, data: {} };
  }, []);

  return {
    fuelRequests,
    isLoading,
    error,
    fetchFuelRequests,
    createFuelRequest,
  };
};
