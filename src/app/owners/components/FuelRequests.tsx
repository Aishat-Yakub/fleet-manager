import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, X } from 'lucide-react';
import { useFuelRequests } from '@/app/owners/hooks/useFuelRequests';
import { FuelRequest } from '../types';

interface FuelRequestsProps {
  ownerId: string;
}

export const FuelRequests = ({ ownerId }: FuelRequestsProps) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    vehicleId: '',
    amount: '',
    notes: '',
    account_details: '',
  });

  const { fuelRequests, isLoading, error, createFuelRequest } = useFuelRequests(ownerId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Create a temporary vehicle name since it's required in the type
    const vehicleName = `Vehicle ${formData.vehicleId}`;
    
    const result = await createFuelRequest({
      vehicle: vehicleName,
      vehicleId: formData.vehicleId,
      amount: formData.amount,
      notes: formData.notes,
      account_details: formData.account_details
    });
    
    if (result.success) {
      setFormData({ vehicleId: '', amount: '', notes: '', account_details: '' });
      setShowForm(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Fuel Requests</CardTitle>
          <Button
            size="sm"
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-1"
          >
            {showForm ? (
              <>
                <X className="h-4 w-4" /> Cancel
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" /> New Request
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {showForm && (
          <form onSubmit={handleSubmit} className="space-y-4 mb-6 p-4 border rounded-lg bg-slate-50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="vehicleId">Vehicle</Label>
                <Input
                  id="vehicleId"
                  name="vehicleId"
                  value={formData.vehicleId}
                  onChange={handleChange}
                  placeholder="Vehicle ID"
                  required
                  className='text-black placeholder:text-gray-500'
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (Liters)</Label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="e.g. 20"
                  required
                  className='text-black placeholder:text-gray-500'
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Any additional information..."
                rows={2}
                className='text-black placeholder:text-gray-500'
                />
            </div>
            <div className="space-y-2">
              <Label htmlFor="account_details">Account Details <span className="text-red-500">*</span></Label>
              <Input
                id="account_details"
                name="account_details"
                value={formData.account_details}
                onChange={handleChange}
                placeholder="Bank account details for reimbursement"
                required
                className='text-black placeholder:text-gray-500'
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Submitting...' : 'Submit Request'}
              </Button>
            </div>
          </form>
        )}

        {error && (
          <div className="mb-4 p-3 text-sm text-red-700 bg-red-100 rounded-md">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <h3 className="text-lg font-medium text-black">Recent Fuel Requests</h3>
          
          {isLoading && !fuelRequests.length ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : fuelRequests.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No fuel requests found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-950 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-950 uppercase tracking-wider">
                      Vehicle
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-950 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-950 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {fuelRequests.map((request: FuelRequest) => (
                    <tr key={request.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(request.date || request.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {request.vehicle}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {request.amount}L
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            request.status === 'approved'
                              ? 'bg-green-100 text-green-800'
                              : request.status === 'rejected'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
