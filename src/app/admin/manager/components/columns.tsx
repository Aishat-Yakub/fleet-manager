import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Vehicle } from '../types';
import { updateVehicleStatus, getVehicles } from '@/services/managerService';
import { useState } from 'react';

export const columns = (refreshVehicles?: () => void): ColumnDef<Vehicle>[] => [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'make',
    header: 'Make',
  },
  {
    accessorKey: 'model',
    header: 'Model',
  },
  {
    accessorKey: 'year',
    header: 'Year',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <span className={`px-2 py-1 rounded-full text-xs ${
        row.original.status === 'active' 
          ? 'bg-green-100 text-green-800' 
          : 'bg-red-100 text-red-800'
      }`}>
        {row.original.status}
      </span>
    ),
  },
  {
    id: 'actions',
    cell: ({ row }) => {
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
            className={`bg-blue-600 hover:bgblue text-white ${row.original.status === 'active' ? 'bg-blue-800/50' : ''}`}
            disabled={row.original.status === 'active' || loading}
            onClick={() => handleStatusChange('active')}
          >
            Set Active
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className={`text-white bg-red-600 hover:bg-red-700 ${row.original.status === 'inactive' ? 'bg-red-800/50 backdrop-blur-lg text-black border-none' : ''}`}
            disabled={row.original.status === 'inactive' || loading}
            onClick={() => handleStatusChange('inactive')}
          >
            Set Inactive
          </Button>
        </div>
      );
    },
  },
];
