'use client';

import { Plus, Trash2, Edit, Car } from 'lucide-react';

type Vehicle = {
  id: string;
  plateNumber: string;
  model: string;
  color: string;
  status: 'active' | 'maintenance' | 'inactive';
  lastService: string;
};

export default function VehiclesPage() {
  // Mock data for demonstration
  const vehicles: Vehicle[] = [
    {
      id: '1',
      plateNumber: 'LASU-123',
      model: 'Toyota Camry',
      color: 'White',
      status: 'active',
      lastService: '2023-07-15',
    },
    {
      id: '2',
      plateNumber: 'LAG-456XY',
      model: 'Ford Transit',
      color: 'Blue',
      status: 'maintenance',
      lastService: '2023-06-20',
    },
  ];

  const handleAddVehicle = () => {
    // TODO: Implement add vehicle logic
    console.log('Add vehicle clicked');
  };

  const handleEditVehicle = (id: string) => {
    // TODO: Implement edit vehicle logic
    console.log('Edit vehicle:', id);
  };

  const handleDeleteVehicle = (id: string) => {
    // TODO: Implement delete vehicle logic
    console.log('Delete vehicle:', id);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 tepxt-gray-800';
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Vehicle Management</h1>
        <button 
          onClick={handleAddVehicle}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          Add Vehicle
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vehicle Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Plate Number
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Color
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Service
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {vehicles.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  <div className="flex flex-col items-center justify-center">
                    <Car className="h-12 w-12 text-gray-300 mb-2" />
                    <p className="text-lg font-medium">No vehicles found</p>
                    <p className="text-sm mt-1">Get started by adding a new vehicle</p>
                    <button 
                      onClick={handleAddVehicle}
                      className="mt-4 inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                      <Plus className="-ml-1 mr-2 h-4 w-4" />
                      Add Vehicle
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              vehicles.map((vehicle) => (
                <tr key={vehicle.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex items-center justify-center rounded-full bg-blue-100 text-blue-600">
                        <Car className="h-5 w-5" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {vehicle.model}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {vehicle.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                    {vehicle.plateNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div 
                        className="h-4 w-4 rounded-full mr-2" 
                        style={{ backgroundColor: vehicle.color.toLowerCase() }}
                      />
                      <span className="capitalize">{vehicle.color}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(vehicle.lastService).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(vehicle.status)}`}>
                      {vehicle.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <button 
                      onClick={() => handleEditVehicle(vehicle.id)}
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <Edit className="-ml-0.5 mr-1.5 h-4 w-4" />
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteVehicle(vehicle.id)}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                    >
                      <Trash2 className="-ml-0.5 mr-1.5 h-4 w-4" />
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
