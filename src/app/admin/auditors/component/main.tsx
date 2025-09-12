'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { useAuditorData, Vehicle, FuelRequest, MaintenanceRequest, VehicleCondition } from '@/services/auditorService';
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
      <div className="border-l-4 border-red-400 p-4">
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
      {/* Header with Title and Search */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Auditor Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">Monitor and manage fleet operations</p>
        </div>
        <div className="w-full sm:w-96">
          <div className="relative">
            <input
              type="text"
              placeholder="Search across all data..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
            <svg
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Responsive Tab Navigation */}
      <div className="bg-transparent rounded-lg border border-gray-200">
        <nav className="flex flex-wrap -mb-px" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('vehicles')}
            className={`
              flex-1 min-w-[100px] xs:min-w-[120px] px-2 xs:px-3 sm:px-4 py-2 xs:py-3 text-center text-xs xs:text-sm font-medium border-b-2 transition-colors
              ${activeTab === 'vehicles'
                ? 'border-blue-500 text-blue-600 bg-blue-50'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50'
              }
            `}
          >
            <div className="flex flex-col items-center">
              <span className="hidden xs:inline"> All Vehicles</span>
              <span className="xs:hidden">Vehicles</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('fuel-requests')}
            className={`
              flex-1 min-w-[100px] xs:min-w-[120px] px-2 xs:px-3 sm:px-4 py-2 xs:py-3 text-center text-xs xs:text-sm font-medium border-b-2 transition-colors
              ${activeTab === 'fuel-requests'
                ? 'border-blue-500 text-blue-600 bg-blue-50'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50'
              }
            `}
          >
            <div className="flex flex-col items-center">
              <span className="hidden xs:inline font-bold">Fuel Requests</span>
              <span className="xs:hidden font-bold">Fuel requests</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('maintenance-requests')}
            className={`
              flex-1 min-w-[100px] xs:min-w-[120px] px-2 xs:px-3 sm:px-4 py-2 xs:py-3 text-center text-xs xs:text-sm font-medium border-b-2 transition-colors
              ${activeTab === 'maintenance-requests'
                ? 'border-blue-500 text-blue-600 bg-blue-50'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50'
              }
            `}
          >
            <div className="flex flex-col items-center">
              <span className="hidden xs:inline font-bold">Maintenance</span>
              <span className="xs:hidden font-bold">Maintenance requests</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('condition-updates')}
            className={`
              flex-1 min-w-[100px] xs:min-w-[120px] px-2 xs:px-3 sm:px-4 py-2 xs:py-3 text-center text-xs xs:text-sm font-medium border-b-2 transition-colors
              ${activeTab === 'condition-updates'
                ? 'border-blue-500 text-blue-600 bg-blue-50'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50'
              }
            `}
          >
            <div className="flex flex-col items-center">
              <span className="hidden xs:inline font-bold">Conditions</span>
              <span className="xs:hidden font-bold">Condition Updates</span>
            </div>
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-transparent rounded-lg border border-gray-200 overflow-hidden">
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
    </div>
  );
}
