'use client';

import { useState, useEffect, FormEvent } from 'react';
import { X } from 'lucide-react';
import { User, UserPayload } from '@/types/user';

interface UserFormModalProps {
  user: User | null;
  onClose: () => void;
  onSave: (payload: UserPayload, id?: string) => Promise<void>;
}

export default function UserFormModal({ user, onClose, onSave }: UserFormModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<User['role']>('owner');
  const [status, setStatus] = useState<User['status']>('active');
  const [error, setError] = useState<string | null>(null);

  const isEditing = user !== null;

  useEffect(() => {
    if (isEditing) {
      setName(user.name);
      setEmail(user.email);
      setUsername(user.username);
      setRole(user.role);
      setStatus(user.status);
      setPassword(''); // Clear password for security
    }
  }, [user, isEditing]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name || !username || !email || (!password && !isEditing)) {
      setError('Name, email, username, and password are required.');
      return;
    }

    const payload: UserPayload = { name, email, username, role, status };
    if (password) {
      payload.password = password;
    }

    try {
      await onSave(payload, user?.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{isEditing ? 'Edit User' : 'Add New User'}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <div className="space-y-4">
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name" className="w-full p-2 border rounded" required />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full p-2 border rounded" required />
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" className="w-full p-2 border rounded" required />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={isEditing ? 'New Password (optional)' : 'Password'} className="w-full p-2 border rounded" />
            <select value={role} onChange={(e) => setRole(e.target.value as User['role'])} className="w-full p-2 border rounded">
              <option value="owner">Owner</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
              <option value="auditor">Auditor</option>
            </select>
            <select value={status} onChange={(e) => setStatus(e.target.value as User['status'])} className="w-full p-2 border rounded">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
          <div className="mt-6 flex justify-end gap-4">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">Save User</button>
          </div>
        </form>
      </div>
    </div>
  );
}
