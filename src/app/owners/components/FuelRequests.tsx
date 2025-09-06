import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Plus, X } from 'lucide-react';
import { useFuelRequests } from '@/app/owners/hooks/useFuelRequests';
import { FuelRequest } from '../types';
import { FuelRequestForm } from './FuelRequestForm';
import { format } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

// Simple Badge component for status display
const Badge = ({ 
  children, 
  className = '', 
  variant = 'default' 
}: { 
  children: React.ReactNode; 
  className?: string; 
  variant?: 'default' | 'destructive' | 'outline' 
}) => {
  const baseStyles = 'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors';
  const variants = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/80 border-transparent',
    destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/80 border-transparent',
    outline: 'text-foreground border-border',
  };
  
  return (
    <span className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

interface FuelRequestsProps {
  ownerId: string;
}

type FuelRequestWithVehicle = FuelRequest & {
  vehicle?: string;
  vehicle_id: string | number;
  created_at?: string;
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'approved':
      return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
    case 'rejected':
      return <Badge variant="destructive">Rejected</Badge>;
    case 'completed':
      return <Badge className="bg-blue-100 text-blue-800">Completed</Badge>;
    default:
      return <Badge variant="outline">Pending</Badge>;
  }
};

export const FuelRequests = ({ ownerId }: FuelRequestsProps) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    vehicle_id: '',
    litres: '',
    reason: '',
    account_details: '',
  });

  const { 
    fuelRequests, 
    isLoading, 
    error, 
    createFuelRequest, 
    fetchFuelRequests 
  } = useFuelRequests(ownerId) as { 
    fuelRequests: FuelRequestWithVehicle[]; 
    isLoading: boolean; 
    error: string | null; 
  createFuelRequest: (data: unknown) => Promise<{ success: boolean; data?: FuelRequestWithVehicle; error?: string }>; 
    fetchFuelRequests: () => Promise<void>; 
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Ensure required fields are present
    if (!formData.vehicle_id || !formData.litres || !formData.reason) {
      // Handle validation error
      return;
    }

    const result = await createFuelRequest({
      vehicle_id: formData.vehicle_id,
      litres: formData.litres,
      reason: formData.reason,
      ...(formData.account_details ? { account_details: formData.account_details } : {}),
    });
    
    if (result.success) {
      setFormData({ vehicle_id: '', litres: '', reason: '', account_details: '' });
      setShowForm(false);
    }
  };

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleCancel = useCallback(() => {
    setShowForm(false);
    setFormData({ vehicle_id: '', litres: '', reason: '', account_details: '' });
  }, []);


  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-lg font-medium">Fuel Requests</CardTitle>
          <CardDescription>
            {showForm ? 'Create a new fuel request' : 'View and manage your fuel requests'}
          </CardDescription>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          variant={showForm ? 'outline' : 'default'}
          size="sm"
          className="gap-1"
        >
          {showForm ? (
            <>
              <X className="h-4 w-4" />
              Cancel
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" />
              New Request
            </>
          )}
        </Button>
      </CardHeader>
      
      <CardContent>
        {showForm && (
          <div className="mb-6 p-4 border rounded-lg bg-muted/10">
            <h3 className="text-lg font-medium mb-4">New Fuel Request</h3>
            <FuelRequestForm
              formData={formData}
              isLoading={isLoading}
              error={error}
              onSubmit={handleSubmit}
              onInputChange={handleInputChange}
              onCancel={handleCancel}
            />
          </div>
        )}

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Recent Requests</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={fetchFuelRequests}
              disabled={isLoading}
            >
              {isLoading ? 'Refreshing...' : 'Refresh'}
            </Button>
          </div>
          
          {error && (
            <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg">
              {error}
            </div>
          )}

          {isLoading && !fuelRequests.length ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : fuelRequests.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No fuel requests found.
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fuelRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">
                        {request.vehicle || `Vehicle ${request.vehicle_id}`}
                      </TableCell>
                      <TableCell>{request.litres} L</TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {request.reason}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(request.status)}
                      </TableCell>
                      <TableCell>
                        {request.created_at 
                          ? format(new Date(request.created_at), 'MMM d, yyyy')
                          : 'N/A'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          
          {fuelRequests.length > 0 && (
            <div className="mt-4 text-sm text-muted-foreground text-right">
              Showing {fuelRequests.length} request{fuelRequests.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
