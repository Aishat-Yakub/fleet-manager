'use client';

import { useState, useEffect } from 'react';
import { Plus, Users, Trash2 } from 'lucide-react';
import Link from 'next/link';

type User = {
  id: string;
  vehicle_id: string;
  role_id: number;
  roles?: {
    role_name: string;
  };
  status?: 'active' | 'inactive';
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);

  // Fetch users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`/api/owners?type=users`);
        if (!response.ok) throw new Error('Failed to fetch users');
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Function to get role name from role_id
  const getRoleName = (roleId: number) => {
    switch (roleId) {
      case 1:
        return 'User';
      case 2:
        return 'Admin';
      case 3:
        return 'Manager';
      case 4:
        return 'Auditor';
      default:
        return 'Unknown';
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
    
    try {
      setIsDeleting(prev => ({ ...prev, [userId]: true }));
      setError(null);
      
      const response = await fetch('/api/owners', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: userId })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete user');
      }
      
      // Update local state to remove the deleted user
      setUsers(users.filter(user => user.id !== userId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete user');
    } finally {
      setIsDeleting(prev => {
        const newState = { ...prev };
        delete newState[userId];
        return newState;
      });
    }
  };

  if (isLoading) return <div className='text-sky-950 text-2xl'>Loading...</div>;
  if (error) return <div className='text-red-600 text-2xl'>Error: {error}</div>;

  const usersArray = Array.isArray(users) ? users : [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold flex items-center text-sky-950">
          <Users className="mr-2 text-sky-950" /> Users Management
        </h1>
        {/* Add User button only, no edit logic */}
        <Link href="/admin/users/create">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
          >
            <Plus size={18} className="mr-1" /> Add User
          </button>
        </Link>
      </div>

      <div className="bg-white/30 rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vehicle ID
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
          <tbody className="bg-transparent divide-y divide-gray-200">
            {usersArray.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{user.vehicle_id}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{getRoleName(user.role_id)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {user.status || 'inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    disabled={isDeleting[user.id]}
                    className={`${isDeleting[user.id] ? 'text-gray-400 cursor-not-allowed' : 'text-red-600 hover:text-red-900'}`}
                    title="Delete user"
                  >
                    {isDeleting[user.id] ? (
                      <div className="w-4 h-4 border-2 border-gray-400 border-t-2 border-t-red-600 rounded-full animate-spin"></div>
                    ) : (
                      <Trash2 size={18} />
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>


    </div>
  );
}
