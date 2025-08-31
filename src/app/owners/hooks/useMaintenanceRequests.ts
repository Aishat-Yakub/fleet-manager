import { useState, useCallback, useEffect } from 'react';
import { MaintenanceRequest } from '../types';

export const useMaintenanceRequests = (ownerId: string) => {
  const [maintenanceRequests, setMaintenanceRequests] = useState<MaintenanceRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMaintenanceRequests = useCallback(async () => {
    if (!ownerId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/maintenance?ownerId=${ownerId}`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch maintenance requests');
      }
      
      const data = await response.json();
      
      // Ensure we have an array of requests with proper formatting
      const formattedData = Array.isArray(data) 
        ? data.map((req: any) => ({
            ...req,
            created_at: req.created_at || new Date().toISOString(),
            status: req.status || 'pending',
            priority: req.priority || 'medium',
            // Ensure vehicle data is properly formatted
            vehicle: req.vehicle ? {
              id: req.vehicle.id,
              make: req.vehicle.make || 'Unknown',
              model: req.vehicle.model || 'Unknown',
              year: req.vehicle.year || new Date().getFullYear(),
              license_plate: req.vehicle.license_plate || ''
            } : undefined
          }))
        : [];
        
      setMaintenanceRequests(formattedData);
    } catch (err) {
      console.error('Error fetching maintenance requests:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [ownerId]);

  const createMaintenanceRequest = useCallback(async (requestData: Omit<MaintenanceRequest, 'id' | 'status' | 'created_at' | 'updated_at' | 'vehicle'>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/maintenance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...requestData,
          status: 'pending' // Set default status
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to create maintenance request');
      }

      const data = await response.json();
      setMaintenanceRequests(prev => [data, ...prev]);
      return { success: true, data };
    } catch (err) {
      console.error('Error creating maintenance request:', err);
      setError(err instanceof Error ? err.message : 'Failed to create request');
      return { success: false, error: err };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateMaintenanceRequestStatus = useCallback(async (requestId: number, status: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/owners?id=${requestId}`, {
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
        prev.map(req => 
          req.id === updatedRequest.id ? updatedRequest : req
        )
      );
      
      return { success: true, data: updatedRequest };
    } catch (err) {
      console.error('Error updating maintenance request status:', err);
      setError(err instanceof Error ? err.message : 'Failed to update status');
      return { success: false, error: err };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchMaintenanceRequests();
  }, [fetchMaintenanceRequests]);

  return {
    maintenanceRequests,
    isLoading,
    error,
    fetchMaintenanceRequests,
    createMaintenanceRequest,
    updateMaintenanceRequestStatus,
  };
};
