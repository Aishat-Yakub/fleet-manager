import { useState, useCallback, useEffect } from 'react';
import { MaintenanceRequest } from '../types';
import { createMaintenanceRequest, getMaintenanceRequests, updateMaintenanceRequest as updateRequest } from '@/services/maintenanceService';

export function useMaintenanceRequests(ownerId?: string) {
  const [maintenanceRequests, setMaintenanceRequests] = useState<MaintenanceRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMaintenanceRequests = useCallback(async () => {
    if (!ownerId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await getMaintenanceRequests(ownerId);
      setMaintenanceRequests(data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch maintenance requests';
      setError(errorMessage);
      console.error('Error fetching maintenance requests:', err);
    } finally {
      setIsLoading(false);
    }
  }, [ownerId]);

  const createRequest = useCallback(async (requestData: Omit<MaintenanceRequest, 'id' | 'status' | 'created_at'>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const newRequest = await createMaintenanceRequest({
        ...requestData,
        owner_id: ownerId || '',
      });
      
      await fetchMaintenanceRequests();
      return { success: true, data: newRequest };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create maintenance request';
      setError(errorMessage);
      console.error('Error creating maintenance request:', err);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [ownerId, fetchMaintenanceRequests]);

  const updateMaintenanceRequest = useCallback(async (id: string, status: 'pending' | 'approved' | 'rejected' | 'completed') => {
    setIsLoading(true);
    setError(null);
    
    try {
      const updatedRequest = await updateRequest(id, status);
      await fetchMaintenanceRequests();
      return { success: true, data: updatedRequest };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update maintenance request';
      setError(errorMessage);
      console.error('Error updating maintenance request:', err);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [fetchMaintenanceRequests]);

  useEffect(() => {
    fetchMaintenanceRequests();
  }, [fetchMaintenanceRequests]);

  return {
    maintenanceRequests,
    isLoading,
    error,
    createMaintenanceRequest: createRequest,
    updateMaintenanceRequest,
    fetchMaintenanceRequests,
  };
}
