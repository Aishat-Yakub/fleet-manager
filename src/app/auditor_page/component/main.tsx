'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { useAuditorData, Vehicle, FuelRequest, MaintenanceRequest, VehicleCondition } from '@/services/auditorService';
import HeaderAndTabs from './HeaderAndTabs';
import VehiclesTable from './VehiclesTable';
import FuelRequestsTable from './FuelRequestsTable';
import MaintenanceRequestsTable from './MaintenanceRequestsTable';
import ConditionUpdatesTable from './ConditionUpdatesTable';

type ActiveTab = 'vehicles' | 'fuel-requests' | 'maintenance-requests' | 'condition-updates';

export default function AuditorsPage() {
  const {
    conditionUpdates,
    fuelRequests,
    maintenanceRequests,
    vehicles,
    loading,
    error,
    fetchAllData,
    refetchConditionUpdates,
    refetchFuelRequests,
    refetchMaintenanceRequests,
    refetchVehicles
  } = useAuditorData();

  const [activeTab, setActiveTab] = useState<ActiveTab>('vehicles');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch data when tab changes
  useEffect(() => {
    if (activeTab === 'vehicles') {
      refetchVehicles();
    } else if (activeTab === 'fuel-requests') {
      refetchFuelRequests();
    } else if (activeTab === 'maintenance-requests') {
      refetchMaintenanceRequests();
    } else if (activeTab === 'condition-updates') {
      refetchConditionUpdates();
    }
  }, [activeTab, refetchVehicles, refetchFuelRequests, refetchMaintenanceRequests, refetchConditionUpdates]);

  // Filter data based on search query and active tab
  const getFilteredData = (): {
    vehicles: Vehicle[] | null;
    fuelRequests: FuelRequest[] | null;
    maintenanceRequests: MaintenanceRequest[] | null;
    conditionUpdates: VehicleCondition[] | null;
  } => {
    if (!searchQuery) {
      return {
        vehicles: null,
        fuelRequests: null,
        maintenanceRequests: null,
        conditionUpdates: null
      };
    }
    
    const query = searchQuery.toLowerCase();
    
    return {
      vehicles: vehicles.filter(vehicle => 
        vehicle.plate_number.toLowerCase().includes(query) ||
        vehicle.model.toLowerCase().includes(query) ||
        vehicle.Name.toLowerCase().includes(query)
      ),
      fuelRequests: fuelRequests.filter(request => 
        (request.Name && request.Name.toLowerCase().includes(query)) ||
        (request.vehicle_id && request.vehicle_id.toLowerCase().includes(query)) ||
        (request.owner_id && request.owner_id.toLowerCase().includes(query)) ||
        (request.reason && request.reason.toLowerCase().includes(query)) ||
        (request.status && request.status.toLowerCase().includes(query))
      ),
      maintenanceRequests: maintenanceRequests.filter(request => 
        (request.issue && request.issue.toLowerCase().includes(query)) ||
        (request.vehicle_id && request.vehicle_id.toLowerCase().includes(query)) ||
        (request.name && request.name.toLowerCase().includes(query)) ||
        (request.priority && request.priority.toLowerCase().includes(query)) ||
        (request.status && request.status.toLowerCase().includes(query))
      ),
      conditionUpdates: conditionUpdates.filter(update => 
        (update.conditon && update.conditon.toLowerCase().includes(query)) ||
        (update.vehicle_id && update.vehicle_id.toLowerCase().includes(query)) ||
        (update.name && update.name.toLowerCase().includes(query)) ||
        (update.status && update.status.toLowerCase().includes(query)) ||
        (update.note && update.note.toLowerCase().includes(query))
      )
    };
  };

  const filteredData = getFilteredData();
  const isLoading = loading.vehicles || loading.fuelRequests || loading.maintenanceRequests || loading.conditionUpdates;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertTriangle className="h-5 w-5 text-red-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <HeaderAndTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        fetchAllData={fetchAllData}
        loading={isLoading}
      />

      {activeTab === 'vehicles' && (
        <VehiclesTable
          vehicles={vehicles}
          filteredData={filteredData.vehicles}
        />
      )}

      {activeTab === 'fuel-requests' && (
        <FuelRequestsTable
          fuelRequests={fuelRequests}
          filteredData={filteredData.fuelRequests}
        />
      )}

      {activeTab === 'maintenance-requests' && (
        <MaintenanceRequestsTable
          maintenanceRequests={maintenanceRequests}
          filteredData={filteredData.maintenanceRequests}
        />
      )}

      {activeTab === 'condition-updates' && (
        <ConditionUpdatesTable
          conditionUpdates={conditionUpdates}
          filteredData={filteredData.conditionUpdates}
        />
      )}
    </div>
  );
}
