import { ColumnDef } from '@tanstack/react-table';
import { Vehicle } from '../types';
import { VehicleStatusActions } from './VehicleStatusActions';

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
  cell: ({ row }) => <VehicleStatusActions row={row} refreshVehicles={refreshVehicles} />, 
  },
];
