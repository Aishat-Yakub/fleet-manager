'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { MaintenanceRequest } from '../types';

type MaintenanceRequestsListProps = {
  maintenanceRequests: MaintenanceRequest[];
  isLoading: boolean;
};

export function MaintenanceRequestsList({ maintenanceRequests, isLoading }: MaintenanceRequestsListProps) {
  if (isLoading) {
    return <div>Loading maintenance requests...</div>;
  }

  if (maintenanceRequests.length === 0) {
    return <div>No maintenance requests found.</div>;
  }

  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'secondary';
      case 'low':
      default:
        return 'default';
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'in_progress':
        return 'secondary';
      case 'pending':
      default:
        return 'outline';
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Vehicle ID</TableHead>
            <TableHead>Issue</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {maintenanceRequests.map((request) => (
            <TableRow key={request.id}>
              <TableCell>{request.vehicle_id}</TableCell>
              <TableCell className="max-w-[300px] truncate">{request.issue}</TableCell>
              <TableCell>
                <Badge variant={getPriorityBadgeVariant(request.priority)}>
                  {request.priority.charAt(0).toUpperCase() + request.priority.slice(1)}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={getStatusBadgeVariant(request.status || 'pending')}>
                  {request.status ? request.status.replace('_', ' ') : 'Pending'}
                </Badge>
              </TableCell>
              <TableCell>
                {request.created_at ? new Date(request.created_at).toLocaleDateString() : 'N/A'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
