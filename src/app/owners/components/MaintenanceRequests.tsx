import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Plus, X } from 'lucide-react';
import { useMaintenanceRequests } from '@/app/owners/hooks/useMaintenanceRequests';
import { MaintenanceRequest } from '../types';

interface MaintenanceRequestsProps {
  ownerId: string;
}

export const MaintenanceRequests = ({ ownerId }: MaintenanceRequestsProps) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    vehicleId: '',
    issue: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
  });

  const { maintenanceRequests, isLoading, error, createMaintenanceRequest } = 
    useMaintenanceRequests(ownerId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Convert vehicleId to number before sending to the API
    const requestData = {
      ...formData,
      vehicleId: parseInt(formData.vehicleId, 10),
    };
    
    const result = await createMaintenanceRequest(requestData);
    
    if (result.success) {
      setFormData({ vehicleId: '', issue: '', priority: 'medium' });
      setShowForm(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Maintenance Requests</CardTitle>
            <CardDescription>
              Submit and track maintenance requests for your vehicles
            </CardDescription>
          </div>
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
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="vehicleId">Vehicle ID</Label>
                <Input
                  id="vehicleId"
                  name="vehicleId"
                  value={formData.vehicleId}
                  onChange={handleChange}
                  placeholder="Enter vehicle ID"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="issue">Issue Description</Label>
                <Textarea
                  id="issue"
                  name="issue"
                  value={formData.issue}
                  onChange={handleChange}
                  placeholder="Describe the issue in detail..."
                  rows={3}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
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

        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Recent Maintenance Requests
          </h3>

          {isLoading && !maintenanceRequests.length ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : maintenanceRequests.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No maintenance requests found.
            </div>
          ) : (
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Vehicle
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Issue
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Priority
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {maintenanceRequests.map((request: MaintenanceRequest) => (
                    <tr key={request.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {request.vehicle?.name || `Vehicle #${request.vehicleId}`}
                        {request.vehicle?.plateNumber && (
                          <span className="block text-xs text-gray-500">
                            {request.vehicle.plateNumber}
                          </span>
                        )}
                      </td>
                      <td className="whitespace-normal px-3 py-4 text-sm text-gray-500">
                        {request.issue}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4">
                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                          request.priority === 'high' 
                            ? 'bg-red-100 text-red-800' 
                            : request.priority === 'medium'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                        }`}>
                          {request.priority.charAt(0).toUpperCase() + request.priority.slice(1)}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4">
                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(request.status)}`}>
                          {request.status.split('-').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {new Date(request.createdAt).toLocaleDateString()}
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
