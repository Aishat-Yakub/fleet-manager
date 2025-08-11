import { useState, useCallback } from 'react';
import { MaintenanceRequest } from '../types';

export const useMaintenanceRequests = (ownerId: string) => {
  const [maintenanceRequests, setMaintenanceRequests] = useState<MaintenanceRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMaintenanceRequests = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`/api/owners/${ownerId}/maintenance-requests`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch maintenance requests');
      }
      
      const data = await response.json();
      setMaintenanceRequests(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching maintenance requests:', err);
    } finally {
      setIsLoading(false);
    }
  }, [ownerId]);

  const createMaintenanceRequest = useCallback(async (requestData: Omit<MaintenanceRequest, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`/api/owners/${ownerId}/maintenance-requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...requestData,
          status: 'pending', // Default status for new requests
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create maintenance request');
      }
      
      const newRequest = await response.json();
      setMaintenanceRequests(prev => [...prev, newRequest]);
      return { success: true, data: newRequest };
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to create maintenance request';
      setError(error);
      console.error('Error creating maintenance request:', err);
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  }, [ownerId]);

  const updateMaintenanceRequestStatus = useCallback(async (requestId: number, status: 'pending' | 'in-progress' | 'completed' | 'rejected') => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`/api/owners/${ownerId}/maintenance-requests/${requestId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update maintenance request status');
      }
      
      const updatedRequest = await response.json();
      setMaintenanceRequests(prev => 
        prev.map(req => req.id === requestId ? updatedRequest : req)
      );
      return { success: true, data: updatedRequest };
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to update maintenance request status';
      setError(error);
      console.error('Error updating maintenance request status:', err);
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  }, [ownerId]);

  return {
    maintenanceRequests,
    isLoading,
    error,
    fetchMaintenanceRequests,
    createMaintenanceRequest,
    updateMaintenanceRequestStatus,
  };
};
