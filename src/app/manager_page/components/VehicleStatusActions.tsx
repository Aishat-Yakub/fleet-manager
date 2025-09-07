import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { updateVehicleStatus } from '@/services/managerService';
import { Row } from '@tanstack/react-table';
import { Vehicle } from '../types';

interface VehicleStatusActionsProps {
  row: Row<Vehicle>;
  refreshVehicles?: () => void;
}

export const VehicleStatusActions: React.FC<VehicleStatusActionsProps> = ({ row, refreshVehicles }) => {
  const [loading, setLoading] = useState(false);

  const handleStatusChange = async (status: 'active' | 'inactive') => {
    setLoading(true);
    try {
      await updateVehicleStatus(row.original.id, status);
      if (refreshVehicles) refreshVehicles();
    } catch (error) {
      console.error('Error updating vehicle status:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex space-x-2">
      <Button 
        variant="outline" 
        size="sm"
        className={`bg-blue-600 text-white hover:bg-blue-700 ${row.original.status === 'inactive' ? 'bg-blue-700' : ''}`}
        disabled={row.original.status === 'active' || loading}
        onClick={() => handleStatusChange('active')}
      >
        Set Active
      </Button>
      <Button 
        variant="outline" 
        size="sm"
        className={`bg-red-600/40 text-white hover:bg-red-700 ${row.original.status === 'active' ? 'bg-red-700/60' : ''}`}
        disabled={row.original.status === 'inactive' || loading}
        onClick={() => handleStatusChange('inactive')}
      >
        Set Inactive
      </Button>
    </div>
  );
};