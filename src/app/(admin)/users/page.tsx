"use client";

import { useState, useEffect } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { userService } from "@/services/userService";
import type { User } from "@/types/user";

export default function UsersTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Define the new user form state with proper types
  const [newUser, setNewUser] = useState<{
    firstName: string;
    lastName: string;
    email: string;
    role: 'admin' | 'user' | 'driver' | 'maintenance';
    status: 'active' | 'inactive' | 'suspended';
    phoneNumber?: string;
  }>({
    firstName: "",
    lastName: "",
    email: "",
    role: "user",
    status: "active",
    phoneNumber: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    // Destructure name and value from the event target
    const { name, value } = e.target;
    
    // Handle form input changes based on the field name
    if (name === 'role') {
      // Update role with type safety for allowed values
      setNewUser(prev => ({
        ...prev,
        role: value as 'admin' | 'user' | 'driver' | 'maintenance'
      }));
    } else if (name === 'status') {
      // Update status with type safety for allowed values
      setNewUser(prev => ({
        ...prev,
        status: value as 'active' | 'inactive' | 'suspended'
      }));
    } else {
      // For all other fields, update directly using the name attribute
      setNewUser(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Fetch users when the component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        console.log('Fetching users...');
        setIsLoading(true);
        // Make API call to get users
        const response = await userService.getUsers();
        console.log('Users API Response:', response);
        // Update users state with response data or empty array if no data
        setUsers(response.data || []);
        console.log('Users state updated with:', response.data || []);
      } catch (err) {
        // Handle and display any errors
        const errorMessage = err instanceof Error ? err.message : 'Failed to load users';
        console.error('Error fetching users:', errorMessage, err);
        setError(errorMessage);
      } finally {
        // Always set loading to false when operation completes
        setIsLoading(false);
      }
    };

    // Execute the fetch users function
    fetchUsers();
    // Empty dependency array means this effect runs once on mount
  }, []);

  // Handle adding a new user
  const handleAddUser = async () => {
    // Validate required fields
    if (!newUser.firstName.trim() || !newUser.lastName.trim() || !newUser.email.trim()) {
      setError('First name, last name, and email are required');
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Create the user with the correct type
      const userData = {
        firstName: newUser.firstName.trim(),
        lastName: newUser.lastName.trim(),
        email: newUser.email.trim(),
        role: newUser.role,
        status: newUser.status,
        phoneNumber: newUser.phoneNumber?.trim() || undefined,
      };
      
      const createdUser = await userService.createUser(userData);
      
      // Update the users list with the new user
      setUsers(prev => [...prev, createdUser]);
      
      // Reset the form
      setNewUser({
        firstName: "",
        lastName: "",
        email: "",
        role: "user",
        status: "active",
        phoneNumber: "",
      });
      
      setIsModalOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create user');
      console.error('Error creating user:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    try {
      setIsLoading(true);
      await userService.deleteUser(id);
      setUsers(prev => prev.filter(user => user.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete user');
      console.error('Error deleting user:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (id: string, status: 'active' | 'inactive' | 'suspended') => {
    try {
      setIsLoading(true);
      const updatedUser = await userService.updateUserStatus(id, status);
      setUsers(prev => prev.map(user => 
        user.id === id ? updatedUser : user
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update user status');
      console.error('Error updating user status:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to get full name
  const getFullName = (user: User) => {
    return `${user.firstName} ${user.lastName}`.trim();
  };

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-sky-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-600">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="p-6  text-sky-950 border border-sky-950 rounded-lg h-full  max-w-full  mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-semibold">Guest List</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg transition"
        >
          <Plus size={16} /> Add Guest
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border border-gray-700 rounded-lg overflow-hidden">
          <thead className="bg-sky-100 text-sky-950">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Role</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Created</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-b border-gray-200 hover:bg-gray-50 transition"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  {getFullName(user)}
                </td>
                <td className="p-3">{user.email}</td>
                <td className="p-3 capitalize">{user.role}</td>
                <td className="p-3">
                  <span 
                    className={`px-2 py-1 text-xs rounded-full ${
                      user.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : user.status === 'inactive'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="p-3">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="p-3 flex items-center justify-center space-x-2">
                  <select
                    value={user.status}
                    onChange={(e) => handleStatusChange(user.id, e.target.value as 'active' | 'inactive' | 'suspended')}
                    className="text-sm p-1 border rounded"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                  </select>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="text-red-500 hover:text-red-400"
                    disabled={isLoading}
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="p-4 text-center text-sky-950 italic"
                >
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 px-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-md relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              disabled={isLoading}
            >
              <X size={20} />
            </button>
            <h3 className="text-xl font-semibold mb-6">Add New User</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      name="firstName"
                      value={newUser.firstName}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                      placeholder="First Name"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      name="lastName"
                      value={newUser.lastName}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                      placeholder="Last Name"
                      required
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={newUser.email}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                  placeholder="john@example.com"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <select
                    name="role"
                    value={newUser.role}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                    required
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    <option value="driver">Driver</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={newUser.status}
                    onChange={(e) => setNewUser({...newUser, status: e.target.value as 'active' | 'inactive' | 'suspended'})}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    disabled={isLoading}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddUser}
                disabled={!newUser.firstName.trim() || !newUser.email.trim() || isLoading}
                className={`px-4 py-2 text-sm font-medium text-white bg-sky-600 border border-transparent rounded-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 ${
                  (!newUser.firstName.trim() || !newUser.email.trim() || isLoading) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? 'Adding...' : 'Add User'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
