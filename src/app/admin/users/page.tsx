'use client';

import { useState } from 'react';
import { Plus, Trash2, Edit, Users } from 'lucide-react';

// User type
type User = {
  id: string;
  name: string;
  email: string;
  username: string;
  role: string;
  status: 'active' | 'inactive';
};

export default function UsersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Mock data
  const users: User[] = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      username: 'johndoe',
      role: 'admin',
      status: 'active',
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      username: 'janesmith',
      role: 'driver',
      status: 'inactive',
    },
  ];

  const handleOpenModal = (user: User | null = null) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingUser(null);
    setIsModalOpen(false);
  };

  const handleSaveUser = () => {
    // No-op for static UI
    handleCloseModal();
  };

  const handleDeleteUser = (id: string) => {
    // No-op for static UI
    console.log('Delete user:', id);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">User Management</h1>
        <button
          onClick={() => handleOpenModal()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          Add User
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Username
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
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
            {users.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  <div className="flex flex-col items-center justify-center">
                    <Users className="h-12 w-12 text-gray-300 mb-2" />
                    <p className="text-lg font-medium">No users found</p>
                    <p className="text-sm mt-1">
                      Get started by adding a new user
                    </p>
                    <button
                      onClick={() => handleOpenModal()}
                      className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <Plus className="-ml-1 mr-2 h-4 w-4" />
                      Add User
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 font-medium">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.username}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                    {user.role}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleOpenModal(user)}
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <Edit className="-ml-0.5 mr-1.5 h-4 w-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
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
