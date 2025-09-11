import { useState, useCallback, useEffect } from 'react';
import { FuelRequest } from '../types';
import { supabase } from '@/lib/supabaseClient';

export const useFuelRequests = (ownerId: string) => {
  const [fuelRequests, setFuelRequests] = useState<FuelRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFuelRequests = useCallback(async () => {
    if (!ownerId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch fuel requests from Supabase
      const { data, error } = await supabase
        .from('fuel_requests')
        .select('*')
        .eq('owner_id', ownerId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setFuelRequests(Array.isArray(data) ? data : []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch fuel requests';
      setError(errorMessage);
      console.error('Error fetching fuel requests:', err);
    } finally {
      setIsLoading(false);
    }
  }, [ownerId]);

  const createFuelRequest = useCallback(async (requestData: Omit<FuelRequest, 'id' | 'status' | 'created_at'>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Create fuel request in Supabase
      const { data, error } = await supabase
        .from('fuel_requests')
        .insert([{
          vehicle_id: requestData.vehicle_id.toString(), // Ensure vehicle_id is stored as string
          owner_id: ownerId,
          litres: Number(requestData.litres) || 0,
          reason: requestData.reason || '',
          bank: requestData.bank || null,
          account: requestData.account || null,
          Name: requestData.Name || '',
          status: 'pending',
        }])
        .select();

      if (error) throw error;
      
      await fetchFuelRequests();
      return { 
        success: true, 
        data: data?.[0] 
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create fuel request';
      setError(errorMessage);
      console.error('Error creating fuel request:', err);
      return { 
        success: false, 
        error: errorMessage 
      };
    } finally {
      setIsLoading(false);
    }
  }, [ownerId, fetchFuelRequests]);

  // Fetch fuel requests on component mount
  useEffect(() => {
    fetchFuelRequests();
  }, [fetchFuelRequests]);

  return {
    fuelRequests,
    isLoading,
    error,
    fetchFuelRequests,
    createFuelRequest,
  };
};
