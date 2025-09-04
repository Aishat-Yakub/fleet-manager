import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { FuelRequest } from '../types';

interface FuelRequestsTableProps {
  fuelRequests: FuelRequest[];
  isLoading: boolean;
  onDelete: (id: string | number) => void;
}

export const FuelRequestsTable = ({
  fuelRequests,
  isLoading,
  onDelete,
}: FuelRequestsTableProps) => {
  if (isLoading && fuelRequests.length === 0) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (fuelRequests.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No fuel requests found.
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Vehicle ID</TableHead>
            <TableHead>Litres</TableHead>
            <TableHead>Reason</TableHead>
            <TableHead>Bank Details</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="w-[50px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {fuelRequests.map((request) => (
            <TableRow key={request.id}>
              <TableCell>{request.vehicle_id}</TableCell>
              <TableCell>{request.litres}L</TableCell>
              <TableCell className="max-w-xs truncate">{request.reason}</TableCell>
              <TableCell className="max-w-[200px] break-words">
                {request.bank && <div className="font-medium">{request.bank}</div>}
                {request.account ? (
                  <div className="text-sm text-gray-600">{request.account}</div>
                ) : (
                  <div className="text-gray-400">No details provided</div>
                )}
              </TableCell>
              <TableCell>
                <span 
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    request.status === 'approved' 
                      ? 'bg-green-100 text-green-800' 
                      : request.status === 'rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                </span>
              </TableCell>
              <TableCell>
                {new Date(request.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(request.id)}
                  className="text-red-600 hover:text-red-800 hover:bg-red-50"
                  title="Delete request"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
