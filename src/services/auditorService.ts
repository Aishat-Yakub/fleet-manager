import { useState, useCallback } from 'react';

// Type definitions for auditor data
export interface VehicleCondition {
  id: number;
  name: string;
  vehicle_id: string;
  conditon: string;  // Note: typo in database - 'conditon' instead of 'condition'
  created_at: string;
  status: string;
  note: string | null;
}

export interface FuelRequest {
  id: string;
  vehicle_id: string;
  owner_id: string;
  litres: number;
  reason: string;
  status: string;
  created_at: string;
  account: number;
  bank: string;
  Name: string;
}

export interface MaintenanceRequest {
  id: string;
  vehicle_id: string;
  issue: string;
  priority: string;
  status: string;
  created_at: string;
  name: string;
}

export interface Vehicle {
  id: string;
  plate_number: string;
  model: string;
  color: string;
  condition: string;
  status: string;
  registration_date: string;
  created_at: string;
  Name: string;
}

// API functions for auditor
export async function getConditionUpdates(): Promise<VehicleCondition[]> {
  const response = await fetch('/api/auditor?type=condition-updates');
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch condition updates');
  }
  
  return response.json();
}

export async function getFuelRequests(): Promise<FuelRequest[]> {
  const response = await fetch('/api/auditor?type=fuel_requests');
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch fuel requests');
  }
  
  return response.json();
}

export async function getMaintenanceRequests(): Promise<MaintenanceRequest[]> {
  const response = await fetch('/api/auditor?type=maintenance-requests');
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch maintenance requests');
  }
  
  return response.json();
}

export async function getVehicles(): Promise<Vehicle[]> {
  const response = await fetch('/api/auditor?type=vehicles');
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch vehicles');
  }
  
  return response.json();
}

// Hook for React components
export function useAuditorData() {
  const [conditionUpdates, setConditionUpdates] = useState<VehicleCondition[]>([]);
  const [fuelRequests, setFuelRequests] = useState<FuelRequest[]>([]);
  const [maintenanceRequests, setMaintenanceRequests] = useState<MaintenanceRequest[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState({
    vehicles: false,
    fuelRequests: false,
    maintenanceRequests: false,
    conditionUpdates: false
  });
  const [error, setError] = useState<string | null>(null);

  const fetchVehicles = async () => {
    setLoading(prev => ({ ...prev, vehicles: true }));
    setError(null);
    try {
      const data = await getVehicles();
      setVehicles(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch vehicles');
    } finally {
      setLoading(prev => ({ ...prev, vehicles: false }));
    }
  };

  const fetchFuelRequests = async () => {
    setLoading(prev => ({ ...prev, fuelRequests: true }));
    setError(null);
    try {
      const data = await getFuelRequests();
      setFuelRequests(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch fuel requests');
    } finally {
      setLoading(prev => ({ ...prev, fuelRequests: false }));
    }
  };

  const fetchMaintenanceRequests = async () => {
    setLoading(prev => ({ ...prev, maintenanceRequests: true }));
    setError(null);
    try {
      const data = await getMaintenanceRequests();
      setMaintenanceRequests(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch maintenance requests');
    } finally {
      setLoading(prev => ({ ...prev, maintenanceRequests: false }));
    }
  };

  const fetchConditionUpdates = async () => {
    setLoading(prev => ({ ...prev, conditionUpdates: true }));
    setError(null);
    try {
      const data = await getConditionUpdates();
      setConditionUpdates(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch condition updates');
    } finally {
      setLoading(prev => ({ ...prev, conditionUpdates: false }));
    }
  };

  const fetchAllData = async () => {
    setLoading({
      vehicles: true,
      fuelRequests: true,
      maintenanceRequests: true,
      conditionUpdates: true
    });
    setError(null);
    
    try {
      const [conditionData, fuelData, maintenanceData, vehiclesData] = await Promise.all([
        getConditionUpdates(),
        getFuelRequests(),
        getMaintenanceRequests(),
        getVehicles()
      ]);
      
      setConditionUpdates(conditionData);
      setFuelRequests(fuelData);
      setMaintenanceRequests(maintenanceData);
      setVehicles(vehiclesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading({
        vehicles: false,
        fuelRequests: false,
        maintenanceRequests: false,
        conditionUpdates: false
      });
    }
  };

  const refetchConditionUpdates = useCallback(() => {
    return getConditionUpdates().then(setConditionUpdates);
  }, []);

  const refetchFuelRequests = useCallback(() => {
    return getFuelRequests().then(setFuelRequests);
  }, []);

  const refetchMaintenanceRequests = useCallback(() => {
    return getMaintenanceRequests().then(setMaintenanceRequests);
  }, []);

  const refetchVehicles = useCallback(() => {
    return getVehicles().then(setVehicles);
  }, []);

  return {
    conditionUpdates,
    fuelRequests,
    maintenanceRequests,
    vehicles,
    loading,
    error,
    fetchVehicles,
    fetchFuelRequests,
    fetchMaintenanceRequests,
    fetchConditionUpdates,
    fetchAllData,
    refetchConditionUpdates,
    refetchFuelRequests,
    refetchMaintenanceRequests,
    refetchVehicles
  };
}
