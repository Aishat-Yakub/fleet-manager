"use client";

import React, { useState, useEffect } from "react";
import { vehicleService, type CreateVehiclePayload } from "@/services/vehicleService";
import { ownerService, type Owner } from "@/services/ownerService";
import { X, Plus, Loader2 } from "lucide-react";

interface VehicleFormData extends Omit<CreateVehiclePayload, 'ownerId'> {
  ownerId: string;
}

export default function VehicleForm() {
  const [formData, setFormData] = useState<VehicleFormData>({
    plateNumber: "",
    registrationDate: "",
    model: "",
    color: "",
    condition: "",
    ownerId: "",
  });

  const [owners, setOwners] = useState<Owner[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingOwners, setLoadingOwners] = useState(true);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showOwnerModal, setShowOwnerModal] = useState(false);
  const [newOwner, setNewOwner] = useState<Omit<Owner, 'id' | 'createdAt' | 'updatedAt'>>({ 
    name: '', 
    email: '', 
    phone: '' 
  });

  // Fetch owners on component mount
  useEffect(() => {
    const fetchOwners = async () => {
      try {
        setLoadingOwners(true);
        const ownersList = await ownerService.getOwners();
        setOwners(ownersList);
      } catch (err) {
        console.error('Error fetching owners:', err);
        setError('Failed to load owners. Please try again later.');
      } finally {
        setLoadingOwners(false);
      }
    };

    fetchOwners();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Basic client validation
    if (!formData.plateNumber.trim() || !formData.model.trim() || !formData.ownerId) {
      setError("Plate number, model, and owner ID are required.");
      return;
    }

    setLoading(true);
    try {
      // Convert ownerId to number for the API
      const payload: CreateVehiclePayload = {
        ...formData,
        ownerId: formData.ownerId,
      };

      const vehicle = await vehicleService.createVehicle(payload);
      
      setSuccess(`Vehicle created successfully with plate: ${vehicle.plateNumber}`);
      
      // Reset form
      setFormData({
        plateNumber: "",
        registrationDate: "",
        model: "",
        color: "",
        condition: "",
        ownerId: "",
      });
      
    } catch (err) {
      console.error('Error creating vehicle:', err);
      setError(
        err instanceof Error 
          ? err.message 
          : "Failed to create vehicle. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAddOwner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOwner.name.trim() || !newOwner.email.trim()) {
      setError('Name and email are required for a new owner');
      return;
    }

    try {
      const createdOwner = await ownerService.createOwner({
        ...newOwner,
        address: newOwner.phone || '',
      });
      
      setOwners(prev => [...prev, createdOwner]);
      setFormData(prev => ({ ...prev, ownerId: createdOwner.id }));
      setShowOwnerModal(false);
      setNewOwner({ name: '', email: '', phone: '' });
      setSuccess('Owner added successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error creating owner:', err);
      setError('Failed to create owner. Please try again.');
    }
  };

  return (
    <div className="p-6 border border-sky-200 rounded-lg bg-white shadow-sm">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Register New Vehicle</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md text-sm">
          {success}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              License Plate Number *
            </label>
            <input
              type="text"
              name="plateNumber"
              placeholder="e.g. ABC123"
              value={formData.plateNumber}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Registration Date
            </label>
            <input
              type="date"
              name="registrationDate"
              value={formData.registrationDate}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vehicle Model *
            </label>
            <input
              type="text"
              name="model"
              placeholder="e.g. Toyota Camry"
              value={formData.model}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Color
            </label>
            <input
              type="text"
              name="color"
              placeholder="e.g. Red"
              value={formData.color}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Condition
            </label>
            <select
              name="condition"
              value={formData.condition}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            >
              <option value="">Select condition</option>
              <option value="Excellent">Excellent</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
              <option value="Poor">Poor</option>
              <option value="Needs Repair">Needs Repair</option>
            </select>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-700">
                Owner *
              </label>
              <button
                type="button"
                onClick={() => setShowOwnerModal(true)}
                className="text-xs text-sky-600 hover:text-sky-800 flex items-center"
              >
                <Plus className="h-3 w-3 mr-1" /> Add New Owner
              </button>
            </div>
            
            {loadingOwners ? (
              <div className="flex items-center justify-center p-2 border border-gray-300 rounded-md bg-gray-50">
                <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                <span className="ml-2 text-sm text-gray-500">Loading owners...</span>
              </div>
            ) : (
              <select
                name="ownerId"
                value={formData.ownerId}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                required
              >
                <option value="">Select an owner</option>
                {owners.map(owner => (
                  <option key={owner.id} value={owner.id}>
                    {owner.name} ({owner.email})
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
        
        <div className="pt-4">
          <button
            type="submit"
            disabled={loading || loadingOwners}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                Registering Vehicle...
              </>
            ) : (
              'Register Vehicle'
            )}
          </button>
        </div>
      </form>

      {/* Add Owner Modal */}
      {showOwnerModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Add New Owner</h3>
                <button
                  type="button"
                  onClick={() => {
                    setShowOwnerModal(false);
                    setNewOwner({ name: '', email: '', phone: '' });
                  }}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <form onSubmit={handleAddOwner} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={newOwner.name}
                    onChange={(e) => setNewOwner({...newOwner, name: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    placeholder="John Doe"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={newOwner.email}
                    onChange={(e) => setNewOwner({...newOwner, email: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    placeholder="john@example.com"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={newOwner.phone || ''}
                    onChange={(e) => setNewOwner({...newOwner, phone: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    placeholder="+1234567890"
                  />
                </div>
                
                <div className="pt-2 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowOwnerModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-sky-600 border border-transparent rounded-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                  >
                    Add Owner
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
